import * as React from 'react';
import * as IconUtils from 'utils/iconUtils';
import * as FileUtils from 'utils/fileUtils';
import { Character, Gender } from 'models';
import { Portrait, TextInput, NumberInput, Dropdown } from 'components';

interface Props {
  name?: string;
  description?: string;
  age?: number;
  isNew?: boolean;
  gender: Gender;
  thumbnail: string;
  handleSubmitCharacter: (char: Character) => void;
  handleAbort: () => void;
}

interface State {
  name: string;
  description: string;
  age: string;
  gender: Gender;
  thumbnail: string;
  invalidated: boolean;
}

const genders: Gender[] = ['male', 'female', 'transgender', 'agender', 'other'];

const genderIcons = [
  IconUtils.buttonIcon('fa-lg fa-mars', 'gender-icon'),
  IconUtils.buttonIcon('fa-lg fa-venus', 'gender-icon'),
  IconUtils.buttonIcon('fa-lg fa-transgender', 'gender-icon'),
  IconUtils.buttonIcon('fa-lg fa-agender', 'gender-icon'),
];

export default class CharacterEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: props.name || '',
      description: props.description || '',
      age: props.age ? props.age.toString() : '',
      gender: 'female',
      thumbnail: props.thumbnail,
      invalidated: false,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      name: nextProps.name || '',
      description: nextProps.description || '',
      age: nextProps.age ? nextProps.age.toString() : '',
      thumbnail: nextProps.thumbnail,
      gender: nextProps.gender,
      invalidated: false,
    });
  }

  updateName = (name: string): void => this.setState({ name, invalidated: true });
  updateDescription = (description: string): void => this.setState({ description, invalidated: true });
  updateAge = (age: string): void => this.setState({ age, invalidated: true });
  updateGender = (gender: Gender): void => this.setState({ gender, invalidated: true });

  submitCharacter = (): void => {
    const newChar = new Character(
      this.state.name,
      this.state.description,
      Number(this.state.age),
      this.state.thumbnail,
      this.state.gender
    );
    // alert( "submit character " + JSON.stringify(newChar) );

    this.props.handleSubmitCharacter(newChar);
  };

  onDrop = (files: File[]) => {
    FileUtils.loadFileAsData(files[0], event => {
      this.setState({
        // tslint:disable-next-line:no-any
        thumbnail: (event.target as any).result,
        invalidated: true,
      });
    });
  };

  render() {
    return (
      <div className="edit-view character-edit">
        <div className="edit-container">
          <Portrait image={this.state.thumbnail} placeholder="placeholder.png" onDrop={this.onDrop} />
          <div className="editform-content">
            <div className="row">
              <div className="twelve columns">
                <TextInput
                  id="character-name"
                  placeholder="name"
                  label="name"
                  content={this.state.name}
                  onChange={(newContent: string) => this.updateName(newContent)}
                />
              </div>
            </div>
            <div className="row">
              <div className="six columns">
                <NumberInput
                  id="character-age"
                  placeholder="age"
                  label="age"
                  min={0}
                  content={this.state.age}
                  onChange={(newContent: string) => this.updateAge(newContent)}
                />
              </div>
              <div className="six columns">
                <Dropdown
                  label="gender"
                  index={genders.indexOf(this.state.gender)}
                  listElements={genders}
                  icons={genderIcons}
                  handleSelect={(idx: number) => this.updateGender(genders[idx])}
                />
              </div>
            </div>

            <TextInput
              id="character-description"
              multiline={true}
              placeholder="..."
              label="description"
              content={this.state.description}
              onChange={(newContent: string) => this.updateDescription(newContent)}
            />
          </div>
        </div>

        {this.state.invalidated && (
          <button onClick={this.submitCharacter} className="button-primary">
            {this.props.isNew ? 'add' : 'update'} {IconUtils.buttonIcon('fa-check')}
          </button>
        )}

        {(this.state.invalidated || this.props.isNew) && (
          <button onClick={this.props.handleAbort} className="button-primary button-left-margin">
            discard {IconUtils.buttonIcon('fa-times')}
          </button>
        )}
      </div>
    );
  }
}
