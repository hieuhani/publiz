import { config } from "../config";

type OmitFirstParameter<T extends unknown[]> = T extends [infer A, ...infer B]
  ? B
  : never;

export function withFirebaseConfig<Fn extends (...args: any[]) => any>(
  fn: Fn
): (...args: OmitFirstParameter<Parameters<Fn>>) => ReturnType<Fn> {
  return fn.bind(null, config.firebase);
}
