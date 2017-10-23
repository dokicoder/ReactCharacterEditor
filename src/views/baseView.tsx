import * as React from 'react';   

export interface ViewProps<T> {
  objects: T[];
  append: (object: T) => void;
  update: (index: number) => (object: T) => void;
  delete: (index: number) => void;
}

interface ViewState {
  selectionIdx: number;
  isNew: boolean;
}

// tslint:disable-next-line:no-any
export abstract class BaseView<T> extends React.Component<any /*ViewProps<T>*/, ViewState> { 

  readonly LOCALSTORAGE_KEY: string = this.constructor.name + "_KEY";

  constructor(props: ViewProps<T>) {
    super(props);

    const storedState = this.fromLocalStorage();
    this.state = storedState || {
      selectionIdx: 0,
      isNew: true
    };
  }

  componentWillReceiveProps(nextProps: ViewProps<T>) {
    const thisObjectsCount = this.props.objects.length;
    const nextObjectsCount = nextProps.objects.length;
    // if new character list is longer than previous one, characters were added, so set index to last new one
    if(nextObjectsCount > thisObjectsCount)
      this.setState( {selectionIdx: nextObjectsCount - 1, isNew: false} );
    // if new character list is shorter than the previous one, fix selectionIdx to avoid out of bounds error
    else if(nextObjectsCount - 1 < this.state.selectionIdx)
      this.setState( {selectionIdx: nextObjectsCount - 1, isNew: false} );
  }

  updateIndex = (idx: number) => {
    // the 2nd argument is a function that is executed after the state is updated
    this.setState( { selectionIdx: idx, isNew: false }, this.toLocalStorage );
  }

  setNewMode = (newMode: boolean) => {
    this.setState( { isNew: newMode }, this.toLocalStorage );
  }

  protected get selectionIdx() {
    const numObjs = this.props.objects.length;
    return Math.min(this.state.selectionIdx, numObjs - 1);
  }

  toLocalStorage = () => {
    localStorage.setItem( this.LOCALSTORAGE_KEY, JSON.stringify( this.state ) );
  }

  fromLocalStorage = (): ViewState => {
    const levelsJson = localStorage.getItem( this.LOCALSTORAGE_KEY );
    return levelsJson ? JSON.parse( levelsJson ) : undefined;
  }

  handleSubmitObject = (obj: T) => {
    if (this.state.isNew)
      this.props.append(obj);
    else
      this.props.update(this.selectionIdx)(obj);
  }

  protected handleDeleteObject = () => {
    this.props.delete(this.selectionIdx);
  }

  abstract render(): JSX.Element;
}