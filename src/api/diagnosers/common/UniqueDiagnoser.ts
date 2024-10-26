import { IDiagnosis } from "../../structures/common/IDiagnosis";

/**
 * Diagnoser of uniqueness.
 *
 * Finds every duplicated elements.
 *
 * @author Samchon
 */
export namespace UniqueDiagnoser {
  /**
   * Properties of unique diagnoser.
   */
  export interface IProps<Element> {
    /**
     * Key getter function.
     */
    key(x: Element): string;

    /**
     * Message generator when duplicated element be found.
     */
    message(elem: Element, index: number): IDiagnosis;

    /**
     * Filter function returning only target elements.
     *
     * @default undefined Accept every elements
     */
    filter?(elem: Element): boolean;

    /**
     * Target elements to validate.
     */
    items: Element[];
  }

  /**
   * Diagnose duplicated elements.
   *
   * Diagnose duplicated elements through {@link HashSet} and returns
   * {@link IDiagnosis} objects describing about the duplicated elements.
   *
   * @param props Properties of the unique diagnoser
   * @returns List of diagnoses messages about duplicated elements
   */
  export const validate = <Element>(props: IProps<Element>) => {
    const output: IDiagnosis[] = [];
    const set: Set<string> = new Set();

    props.items.forEach((elem, index) => {
      if (props.filter && props.filter(elem) === false) return;

      const key: string = props.key(elem);
      if (set.has(key) === true) output.push(props.message(elem, index));
      else set.add(key);
    });
    return output;
  };
}
