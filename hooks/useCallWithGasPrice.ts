import { useCallback } from 'react'
import { publicClient } from 'utils/viem'
import {
  Abi,
  Account,
  Address,
  CallParameters,
  Chain,
  GetFunctionArgs,
  InferFunctionName,
  WriteContractParameters,
} from 'viem'
import { EstimateContractGasParameters } from 'viem/dist/types/actions/public/estimateContractGas'
import { useChainId, useWalletClient } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { calculateGasMargin } from 'utils'

export function useCallWithGasPrice() {
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()

  const callWithGasPriceWithSimulate = useCallback(
    async <
      TAbi extends Abi | unknown[],
      TFunctionName extends string = string,
      _FunctionName = InferFunctionName<TAbi, TFunctionName>,
      Args = TFunctionName extends string
        ? GetFunctionArgs<TAbi, TFunctionName>['args']
        : _FunctionName extends string
        ? GetFunctionArgs<TAbi, _FunctionName>['args']
        : never
    >(
      contract: { abi: TAbi; account: Account; chain: Chain; address: Address },
      methodName: InferFunctionName<TAbi, TFunctionName>,
      methodArgs?: Args extends never ? undefined : Args,
      overrides?: Omit<CallParameters, 'chain' | 'to' | 'data'>
    ): Promise<SendTransactionResult> => {
      const gas = await publicClient.estimateContractGas({
        abi: contract.abi,
        address: contract.address,
        account: walletClient.account,
        functionName: methodName,
        args: methodArgs,

        value: 0n,
        ...overrides,
      } as unknown as EstimateContractGasParameters)
      const res = await walletClient.writeContract({
        abi: contract.abi,
        address: contract.address,
        account: walletClient.account,
        functionName: methodName,
        args: methodArgs,

        gas: calculateGasMargin(gas),
        value: 0n,
        ...overrides,
      } as unknown as WriteContractParameters)

      const hash = res

      return {
        hash,
      }
    },
    [chainId, walletClient]
  )

  return { callWithGasPrice: callWithGasPriceWithSimulate }
}
