import * as React from 'react';

export interface ImageUploadProps {
  className?: string;
  buttonClassName?: string;
  sizeLimit?: number;
  defaultImageData?: string;
  useDefaultStyles?: boolean;
}

export interface ImageUploadState {
  imageData: string;
}

export class ImageUpload extends React.Component<ImageUploadProps, ImageUploadState> {
  public static defaultProps: ImageUploadProps = {
    useDefaultStyles: true
  };
  private components: {
    fileInput?: HTMLInputElement;
    image?: HTMLImageElement
  } = {};
  private sizeLimit: number;
  private readonly defaultSizeLimit = Math.pow(1024, 2); // 1 MB

  private readonly styleDisplayFlex = {
    display: 'flex',
    alignItems: 'center'
  };

  constructor() {
    super(...arguments);
    this.state = {
      imageData: null
    }
  }

  componentWillReceiveProps(props: ImageUploadProps) {
    console.log('componentWillReceiveProps', props);
    this.sizeLimit = props.sizeLimit;
    this.setState({
      imageData: props.defaultImageData
    });
  }

  render() {
    return (
      <section className={this.props.className} >
        <input
          type="file"
          ref={fileInput => this.components.fileInput = fileInput}
          onChange={this.onChange.bind(this)}
          accept="image/*"
          style={{'display': 'none'}}
        />
        <div style={this.props.useDefaultStyles && this.styleDisplayFlex}>
          <div>
            <img
              ref={image => this.components.image = image }
              src={this.state.imageData}
              className="rounded-circle"
              onClick={this.onClick.bind(this)}
            />
          </div>
          <div>
            <div>
              <button onClick={this.onClick.bind(this)} className={this.props.buttonClassName}>Upload Image</button>
            </div>
            <div>File Formats: .jpg, .png, .tiff</div>
          </div>
        </div>
      </section>
    )
  }

  private onClick(event: Event) {
    event.preventDefault();
    this.components.fileInput.click();
  }

  private onChange(event: Event) {
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
    reader.onload = this.onImageLoaded.bind(this);
    reader.readAsDataURL(file);

  }

  private onImageLoaded(event: any) {
    this.setState({
      imageData: event.target.result
    })
  }

}