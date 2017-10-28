import * as React from 'react';
import { GUID } from "../utils/guidUtils";

export interface Props {
  id?: string;
  label?: string;
  index: number;
  listElements: string[];
  handleSelect: (idx: number) => void;
}

const Selector = (props: Props): JSX.Element => {
  const hasLabel = props.label !== undefined;
  const id = props.id || GUID();

  return (
    <div className="selector">
      {hasLabel && <label htmlFor={id}>{props.label}</label>}
      <select
        id={id}
        value={props.index.toString()}
        onChange={ (e: React.ChangeEvent<HTMLSelectElement>) => 
                      props.handleSelect( e.target.selectedIndex ) } 
      >
        { props.listElements.map( 
            (element: string, i: number) => <option key={"option_" + i} value={i}>{element}</option> 
          ) 
        }
      </select>
    </div>
  );
};

export default Selector;