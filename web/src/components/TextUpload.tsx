import * as React from 'react';

export interface TextUploadProps {
  className?: string;
  buttonClassName?: string;
  sizeLimit?: number;
  useDefaultStyles?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export interface TextUploadState {
  text: string;
}

export class TextUpload extends React.Component<TextUploadProps, TextUploadState> {
  public static defaultProps: TextUploadProps = {
    useDefaultStyles: true
  };
  components: {
    fileInput?: HTMLInputElement;
    textArea?: HTMLTextAreaElement;
  } = {};
  private sizeLimit: number;
  private readonly defaultSizeLimit = Math.pow(1024, 2); // 1 MB

  constructor() {
    super(...arguments);
    this.state = {
      text: null
    }
  }

  componentWillReceiveProps(props: TextUploadProps) {
    this.sizeLimit = props.sizeLimit || this.defaultSizeLimit;
  }

  render() {
    return (
      <section className={this.props.className} >
        <input
          type="file"
          ref={fileInput => this.components.fileInput = fileInput}
          onChange={this.onFileInputChange.bind(this)}
          accept=".txt, .md"
          style={{'display': 'none'}}
        />
        <div>
          <textarea ref={textArea => this.components.textArea = textArea} onChange={this.onTextAreaChange.bind(this)} placeholder={this.props.placeholder} />
        </div>
        <div>
          <button onClick={this.onClick.bind(this)} className={this.props.buttonClassName}>Upload</button>
          <span>acceptable formats: .txt, .md</span>
        </div>
      </section>
    )
  }

  private onClick(event: Event) {
    event.preventDefault();
    this.components.fileInput.click();
  }

  private onFileInputChange(event: Event) {
    event.preventDefault();

    const file = this.components.fileInput.files[0];

    if (!file) {
      return;
    }

    if (file.size > this.sizeLimit) {
      console.log('Size is too big');
      return;
    }

    const reader = new FileReader();
    reader.onload = this.onFileLoaded.bind(this);
    reader.readAsText(file);

  }

  private onFileLoaded(event: any) {
    this.components.textArea.value = event.target.result;
    this.props.onChange && this.props.onChange(event.target.result);
  }

  private onTextAreaChange(event: any) {
    this.props.onChange && this.props.onChange(this.components.textArea.value);
  }

}