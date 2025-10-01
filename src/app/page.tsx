"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileIcon,
  Loader2,
} from "lucide-react";
import Papa from "papaparse";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { defineChain, encode, getContract } from "thirdweb";
import { multicall } from "thirdweb/extensions/common";
import {
  getNFTs as getNFTs1155,
  setClaimConditions as setClaimConditions1155,
} from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWalletChain,
  useSendAndConfirmTransaction,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { isAddress, maxUint256 } from "thirdweb/utils";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { client } from "./client";

type CSVInput = {
  name: string;
  price_amount: string;
  price_currency: string;
  supply: string;
};

const batchSize = 50;

const formSchema = z.object({
  chainId: z.coerce.number().min(1, "Chain ID must be at least 1"),
  startBatch: z.coerce.number().int().min(1),
  contractAddress: z
    .string()
    .min(1, "Contract address is required")
    .refine((address) => {
      if (isAddress(address)) {
        return true;
      }
      return false;
    }, "Invalid contract address"),
});

type FormData = z.infer<typeof formSchema>;

type CSVInputState =
  | {
      type: "success";
      data: CSVInput[];
    }
  | {
      type: "error";
      error: string;
    }
  | {
      type: "no-data";
    };

type ProgressState = {
  batchIndex: number;
  totalBatches: number;
  status: "idle" | "pending" | "completed" | "error";
  error?: string;
  formData: FormData;
};

export default function Home() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chainId: 1,
      startBatch: 1,
      contractAddress: "",
    },
  });

  const [csvInput, setCSVInput] = useState<CSVInputState>({
    type: "no-data",
  });

  const [progress, setProgress] = useState<ProgressState>({
    batchIndex: 0,
    totalBatches: 0,
    status: "idle",
    formData: form.getValues(),
  });

  const sendAndConfirmTxNoPayModal = useSendAndConfirmTransaction({
    payModal: false,
  });

  async function handleSetClaimConditionsERC1155(params: {
    batchIndex: number;
    values: {
      csvData: CSVInput[];
      contractAddress: string;
      chainId: number;
    };
  }) {
    const { values, batchIndex } = params;
    const contract = getContract({
      chain: defineChain(params.values.chainId),
      client: client,
      address: params.values.contractAddress,
    });

    const batchStartIndex = batchIndex * batchSize;
    const batchEndIndex = batchStartIndex + batchSize;
    const nfts = values.csvData.slice(batchStartIndex, batchEndIndex);

    // fetch nfts
    const fetchedNFTs = await getNFTs1155({
      contract,
      start: batchStartIndex,
      count: batchSize,
      useIndexer: false,
    });

    const transactions = nfts.map((uploadedNFT, i) => {
      const fetchedNFT = fetchedNFTs[i];

      if (!fetchedNFT) {
        throw new Error("Failed to find NFT");
      }

      if (fetchedNFT.metadata.name !== uploadedNFT.name) {
        throw new Error("Failed to find NFT in batch");
      }

      return setClaimConditions1155({
        contract,
        phases: [
          {
            currencyAddress: uploadedNFT.price_currency,
            maxClaimablePerWallet: maxUint256,
            maxClaimableSupply: BigInt(uploadedNFT.supply), // unlimited
            metadata: {
              name: "Public phase",
            },
            price: uploadedNFT.price_amount,
            startTime: new Date(),
          },
        ],
        tokenId: fetchedNFT.id,
      });
    });

    const encodedTransactions = await Promise.all(
      transactions.map((tx) => encode(tx)),
    );

    const tx = multicall({
      contract: contract,
      data: encodedTransactions,
    });

    await sendAndConfirmTxNoPayModal.mutateAsync(tx);
  }

  async function handleBatch(params: {
    startBatchIndex: number;
    totalBatches: number;
    csvData: CSVInput[];
    contractAddress: string;
    chainId: number;
  }) {
    const { startBatchIndex, totalBatches, csvData, contractAddress, chainId } =
      params;

    const formData = {
      chainId: chainId,
      contractAddress: contractAddress,
      startBatch: startBatchIndex + 1,
    };

    for (let i = startBatchIndex; i < totalBatches; i++) {
      setProgress({
        formData: formData,
        batchIndex: i,
        totalBatches: totalBatches,
        status: "pending",
      });

      try {
        await handleSetClaimConditionsERC1155({
          batchIndex: i,
          values: {
            csvData: csvData,
            contractAddress: contractAddress,
            chainId: chainId,
          },
        });
      } catch (error) {
        setProgress({
          formData: formData,
          batchIndex: i,
          totalBatches: totalBatches,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }

      setProgress({
        batchIndex: i,
        totalBatches: totalBatches,
        status: "completed",
        formData: formData,
      });
    }
  }

  async function handleSubmit(data: FormData) {
    if (csvInput.type !== "success") {
      return;
    }

    await handleBatch({
      startBatchIndex: data.startBatch - 1,
      totalBatches: Math.ceil(csvInput.data.length / batchSize),
      csvData: csvInput.data,
      contractAddress: data.contractAddress,
      chainId: data.chainId,
    });
  }

  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const totalBatches = Math.ceil(
    (csvInput.type === "success" ? csvInput.data.length : 0) / batchSize,
  );

  return (
    <div>
      <div className="border-b">
        <header className="py-6 container max-w-screen-md mx-auto px-4 flex justify-between items-center">
          <h1 className="text-lg font-medium tracking-tight">
            Set ERC1155 claim conditions in bulk{" "}
          </h1>
        </header>
      </div>

      <main className="container max-w-screen-md mx-auto pt-8 pb-20 px-4 space-y-8">
        <UploadCSV csvInput={csvInput} setCSVInput={setCSVInput} />
        {csvInput.type === "success" && csvInput.data.length > 0 && (
          <div className="space-y-6">
            {progress.status === "idle" && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="chainId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chain ID</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contractAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* start batch */}
                  <FormField
                    control={form.control}
                    name="startBatch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Batch from</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            max={totalBatches}
                          />
                        </FormControl>
                        <FormDescription>
                          First batch is 1. Total batches: {totalBatches}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!activeAccount || !activeChain ? (
                    <ConnectButton
                      client={client}
                      connectButton={{
                        className: "!w-full",
                        label: "Connect Wallet to continue",
                      }}
                    />
                  ) : activeChain.id !== form.watch("chainId") ? (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        switchChain(defineChain(form.getValues().chainId));
                      }}
                    >
                      Switch Chain
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full">
                      Set Claim Conditions{" "}
                    </Button>
                  )}
                </form>
              </Form>
            )}

            <Progress
              progress={progress}
              onRetry={() => {
                handleBatch({
                  startBatchIndex: progress.batchIndex,
                  totalBatches: progress.totalBatches,
                  csvData: csvInput.data,
                  contractAddress: progress.formData.contractAddress,
                  chainId: progress.formData.chainId,
                });
              }}
              onGoBack={() => {
                setProgress({
                  ...progress,
                  status: "idle",
                });
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function Progress(props: {
  progress: ProgressState;
  onRetry: () => void;
  onGoBack: () => void;
}) {
  const { progress } = props;
  return (
    <div>
      {progress.status === "pending" && (
        <div className="space-y-2 border rounded-lg p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Processing batch {progress.batchIndex + 1} of{" "}
            {progress.totalBatches}
          </p>
        </div>
      )}

      {progress.status === "completed" && (
        <div className="space-y-2 border rounded-lg p-4">
          <p className="text-sm text-green-500">
            Batch {progress.batchIndex + 1} of {progress.totalBatches} completed
          </p>
        </div>
      )}

      {progress.status === "error" && (
        <div className="space-y-2 border rounded-lg p-4">
          <p className="text-sm text-foreground ">
            Error processing batch {progress.batchIndex + 1} of{" "}
            {progress.totalBatches}
          </p>

          <p className="text-sm text-destructive">Error: {progress.error}</p>
          <div className="flex items-center gap-2 !mt-4">
            <Button onClick={props.onRetry}>Retry</Button>
            <Button variant="outline" onClick={props.onGoBack}>
              Go back to form
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClaimConditionsTable({ data }: { data: CSVInput[] }) {
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-4">Name</TableHead>
              <TableHead className="py-3 px-4">Price Amount</TableHead>
              <TableHead className="py-3 px-4">Price Currency</TableHead>
              <TableHead className="py-3 px-4">Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((input, index) => (
              <TableRow key={`${input.name}-${index}`}>
                <TableCell className="py-3 px-4">{input.name}</TableCell>
                <TableCell className="py-3 px-4">
                  {input.price_amount}
                </TableCell>
                <TableCell className="py-3 px-4">
                  {input.price_currency}
                </TableCell>
                <TableCell className="py-3 px-4">{input.supply}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {page * pageSize + 1} to{" "}
            {Math.min(page * pageSize + pageSize, data.length)} of {data.length}{" "}
            entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeftIcon className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === pageCount - 1}
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadCSV(props: {
  csvInput: CSVInputState;
  setCSVInput: (csvInput: CSVInputState) => void;
}) {
  const handleCSVInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            props.setCSVInput({
              type: "error",
              error: `CSV parsing error: ${results.errors[0].message}`,
            });
            return;
          }

          const data = results.data as CSVInput[];

          // Validate required columns
          const requiredColumns = [
            "name",
            "price_amount",
            "supply",
            "price_currency",
          ];
          const hasAllColumns = requiredColumns.every(
            (col) => data.length > 0 && col in data[0],
          );

          if (!hasAllColumns) {
            props.setCSVInput({
              type: "error",
              error: `Missing required columns. Expected: ${requiredColumns.join(", ")}`,
            });
            return;
          }

          props.setCSVInput({
            type: "success",
            data: data,
          });
        },
        error: (error) => {
          props.setCSVInput({
            type: "error",
            error: `File reading error: ${error.message}`,
          });
        },
      });
    }
  };

  if (props.csvInput.type === "success") {
    return <ClaimConditionsTable data={props.csvInput.data} />;
  }

  return (
    <div>
      <Label htmlFor="csv-input" className="text-base font-medium">
        Upload CSV File
      </Label>
      <p className="text-sm text-muted-foreground">
        Upload a CSV file with the {`"name"`}, {`"price_amount"`}, {`"supply"`},{" "}
        {`"price_currency"`} columns.
      </p>
      <div className="w-full mt-3 border rounded-lg p-4 relative items-center gap-2 hover:border-foreground py-10 text-center flex flex-col justify-center">
        <div className="flex mb-1">
          <div className="border rounded-full p-2.5">
            <FileIcon className="size-4 text-muted-foreground" />
          </div>
        </div>
        Upload CSV File
        {/** biome-ignore lint/nursery/useUniqueElementIds: ok */}
        <input
          type="file"
          accept=".csv"
          id="csv-input"
          className="opacity-0 absolute inset-0 cursor-pointer"
          onChange={handleCSVInputChange}
        />
      </div>

      {props.csvInput.type === "error" && (
        <div className="text-sm text-destructive mt-4">
          {props.csvInput.error}
        </div>
      )}
    </div>
  );
}
