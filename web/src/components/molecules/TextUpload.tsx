import * as React from 'react';

import { ClassNameProps } from '../../common';

export interface TextUploadProps extends ClassNameProps {
  readonly text?: string;
  readonly onChange?: (value: string) => void;
  readonly onFileNameChange?: (fileName: string) => void;

  readonly sizeLimit?: number;

  readonly buttonClassName?: string;
  readonly useDefaultStyles?: boolean;
  readonly placeholder?: string;
}

export class TextUpload extends React.Component<TextUploadProps, undefined> {
  public static defaultProps: TextUploadProps = {
    useDefaultStyles: true
  };
  private fileInput?: HTMLInputElement;
  private textArea?: HTMLTextAreaElement;
  private readonly defaultSizeLimit = Math.pow(1024, 2); // 1 MB
  private sizeLimit: number;

  componentWillReceiveProps(props: TextUploadProps) {
    this.sizeLimit = props.sizeLimit || this.defaultSizeLimit;
  }

  render() {
    return (
      <section className={this.props.className} >
        <input
          type="file"
          ref={fileInput => this.fileInput = fileInput}
          onChange={this.onFileInputChange.bind(this)}
          accept=".txt, .md"
          style={{'display': 'none'}}
        />
        <div>
          <textarea
            ref={textArea => this.textArea = textArea}
            value={this.props.text}
            onChange={this.onTextAreaChange.bind(this)}
            placeholder={this.props.placeholder} />
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
    this.fileInput.click();
  }

  private onFileInputChange(event: Event) {
    event.preventDefault();

    const file = this.fileInput.files[0];

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

    this.props.onFileNameChange && this.props.onFileNameChange(file.name);

  }

  private onFileLoaded(event: any) {
    this.props.onChange && this.props.onChange(event.target.result);
  }

  private onTextAreaChange(event: any) {
    this.props.onChange && this.props.onChange(this.textArea.value);
  }

}