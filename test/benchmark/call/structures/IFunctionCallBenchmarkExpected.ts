export type IFunctionCallBenchmarkExpected =
  | IFunctionCallBenchmarkExpected.IAllOf
  | IFunctionCallBenchmarkExpected.IAnyOf
  | IFunctionCallBenchmarkExpected.IArray
  | IFunctionCallBenchmarkExpected.IStandalone;
export namespace IFunctionCallBenchmarkExpected {
  /**
   * 이들 모두가 실행되어야 만족이되, 순서는 중요하지 않음.
   */
  export interface IAllOf {
    type: "allOf";
    allOf: Array<
      Exclude<
        IFunctionCallBenchmarkExpected,
        IFunctionCallBenchmarkExpected.IAllOf
      >
    >;
  }

  /**
   * 이 중 단 하나만 실행되어도 만족.
   */
  export interface IAnyOf {
    type: "anyOf";
    anyOf: Array<
      Exclude<
        IFunctionCallBenchmarkExpected,
        IFunctionCallBenchmarkExpected.IAnyOf
      >
    >;
  }

  /**
   * 이들 모두가 순서대로 실행되어야 함.
   */
  export interface IArray {
    type: "array";
    items: Array<
      Exclude<
        IFunctionCallBenchmarkExpected,
        IFunctionCallBenchmarkExpected.IArray
      >
    >;
  }

  /**
   * 단독 실행 조건.
   */
  export interface IStandalone {
    type: "standalone";
    function(...args: any[]): Promise<any>;
  }
}
