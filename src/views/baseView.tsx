import * as React from 'react';
import Entity from './../models/entity';

export interface ViewProps<T extends Entity> {
  selectionIdx: number;

  objects: T[];
  append: (object: T) => void;
  update: (index: number) => (object: T) => void;
  delete: (index: number) => void;
  toObjectView: (o: any) => void;

  updateSelectionIdx: (idx: number) => void;
}

interface ViewState {
  isNew: boolean;
}

// tslint:disable-next-line:no-any
export abstract class BaseView<T extends Entity> extends React.Component<any, ViewState> {
  readonly LOCALSTORAGE_KEY: string = this.constructor.name + '_KEY';

  constructor(props: ViewProps<T>) {
    super(props);

    const storedState = this.fromLocalStorage();
    this.state = storedState || {
      //selectionIdx: 0,
      isNew: true,
    };
  }

  componentWillReceiveProps(nextProps: ViewProps<T>) {
    //alert('base props received');

    const thisObjectsCount = this.props.objects.length;
    const nextObjectsCount = nextProps.objects.length;

    // if new character list is longer than previous one, characters were added,
    // so set index to last new one
    if (nextObjectsCount > thisObjectsCount) {
      this.updateIndex(nextObjectsCount - 1);
    } else if (nextObjectsCount - 1 < this.props.selectionIdx) {
      // if new character list is shorter than the previous one,
      // fix selectionIdx to avoid out of bounds error
      this.updateIndex(nextObjectsCount - 1);
    }
  }

  updateIndex = (idx: number) => {
    if (idx === this.props.idx) return;
    this.props.updateSelectionIdx(idx);
    this.setNewMode(false);
  };

  setNewMode = (newMode: boolean) => {
    this.setState({ isNew: newMode }, this.toLocalStorage);
  };

  protected get selectionIdx() {
    const numObjs = this.props.objects.length;
    return Math.min(this.props.selectionIdx, numObjs - 1);
  }

  protected get isNew() {
    return this.props.objects.length === 0 || this.state.isNew;
  }

  toLocalStorage = () => {
    localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(this.state));
  };

  fromLocalStorage = (): ViewState => {
    const levelsJson = localStorage.getItem(this.LOCALSTORAGE_KEY);
    return levelsJson ? JSON.parse(levelsJson) : undefined;
  };

  handleSubmitObject = (obj: T) => {
    if (this.isNew) this.props.append(obj);
    else this.props.update(this.selectionIdx)(obj);
  };

  protected handleDeleteObject = () => {
    this.props.delete(this.selectionIdx);
  };

  abstract render(): JSX.Element;
}
