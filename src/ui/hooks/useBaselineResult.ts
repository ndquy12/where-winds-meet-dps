import { useEffect, useState } from "react"
import type { Inputs, Result } from "../../engine/types"
import type { BaselineWorkerResponse } from "../../engine/dpsWorker"
import { postToDpsWorker, retainedResponse, subscribeToDpsWorker } from "./dpsWorkerClient"
import { useDpsWorkerPending } from "./useDpsWorkerPending"

const EMPTY_RESULT: Result = {
  dps: 0,
  totalDamage: 0,
  rotationDuration: 0,
  graduationRate: null,
  perSkill: [],
  ranking: [],
  warnings: [],
}

function baselineResult(response: BaselineWorkerResponse | null): Result | null {
  return response ? response.result : null
}

export function useBaselineResult(inputs: Inputs): { result: Result; isPending: boolean } {
  const [result, setResult] = useState<Result | null>(() =>
    baselineResult(retainedResponse("baseline")),
  )
  const isPending = useDpsWorkerPending("baseline")

  useEffect(() => {
    return subscribeToDpsWorker("baseline", (response) => setResult(baselineResult(response)))
  }, [])

  useEffect(() => {
    postToDpsWorker({ kind: "baseline", inputs })
  }, [inputs])

  return { result: result ?? EMPTY_RESULT, isPending }
}
