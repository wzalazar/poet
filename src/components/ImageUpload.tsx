import * as React from 'react';

export interface ImageUploadProps {
  className?: string;
  buttonClassName?: string;
  fileSizeLimit?: number;
  imageWidthLimit?: number;
  imageHeightLimit?: number;
  defaultImageData?: string;
  useDefaultStyles?: boolean;
}

export interface ImageUploadState {
  imageData: string;
}

export class ImageUpload extends React.Component<ImageUploadProps, ImageUploadState> {
  public static defaultProps: ImageUploadProps = {
    useDefaultStyles: true,
    imageWidthLimit: 128,
    imageHeightLimit: 128
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
    this.sizeLimit = props.fileSizeLimit;
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
    const imageData = event.target.result;

    let lastTime = performance.now();

    const imageDataUrlToCanvas = this.imageDataUrlToCanvas(imageData);
    console.log('imageDataUrlToCanvas', performance.now() - lastTime); lastTime = performance.now();

    const cropImageIntoSquareFromCenter = this.cropImageIntoSquareFromCenter(imageDataUrlToCanvas);
    console.log('cropImageIntoSquareFromCenter', performance.now() - lastTime); lastTime = performance.now();

    const resizeImage = this.resizeImage(cropImageIntoSquareFromCenter, this.props.imageWidthLimit, this.props.imageHeightLimit);
    console.log('resizeImage', performance.now() - lastTime); lastTime = performance.now();

    const toDataURL = resizeImage.toDataURL("image/png");
    console.log('toDataURL', performance.now() - lastTime); lastTime = performance.now();

    this.setState({
      imageData: toDataURL
    })
  }

  private imageDataUrlToCanvas(imageDataUrl: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const image = document.createElement('img');

    image.src = imageDataUrl;

    canvas.width = image.width;
    canvas.height = image.height;

    const canvasContext = canvas.getContext('2d');
    canvasContext.drawImage(image, 0, 0);

    return canvas;
  }

  /**
   * Takes a canvas with an image drawn on it and returns a new canvas with the resized image.
   * The original canvas is left unmodified.
   */
  private resizeImage(image: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');

    const { width: newWidth, height: newHeight } = this.scaleDownSize(image.width, image.height, maxWidth, maxHeight);

    canvas.width = newWidth;
    canvas.height = newHeight;

    const canvasContext = canvas.getContext('2d');

    canvasContext.drawImage(image, 0, 0, newWidth, newHeight);

    return canvas;
  }

  /**
   * Takes a canvas with an image drawn on it and returns a new canvas with the cropped image.
   * The original canvas is left unmodified.
   */
  private cropImageIntoSquareFromCenter(image: HTMLCanvasElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');

    const newSize = Math.min(image.width, image.height);

    canvas.width = newSize;
    canvas.height = newSize;

    const canvasContext = canvas.getContext('2d');

    canvasContext.drawImage(
      image,
      newSize < image.width ? (image.width - newSize) / 2 : 0,
      newSize < image.height ? (image.height - newSize) / 2 : 0,
      newSize,
      newSize,
      0,
      0,
      newSize,
      newSize);

    return canvas;
  }

  private scaleDownSize(width: number, height: number, maxWidth: number, maxHeight: number): {width: number, height: number} {
    if (width <= maxWidth && height <= maxHeight)
      return { width, height };
    else if (width / maxWidth > height / maxHeight)
      return { width: maxWidth, height: height * maxWidth / width};
    else
      return { width: width * maxHeight / height, height: maxHeight };
  }

}