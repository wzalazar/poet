import * as React from 'react';

export interface ImageUploadProps {
  className?: string;
  buttonClassName?: string;
  fileSizeLimit?: number;
  imageWidthLimit?: number;
  imageHeightLimit?: number;
  defaultImageData?: string;
  useDefaultStyles?: boolean;
  spinnerUrl?: string;
}

export interface ImageUploadState {
  imageData?: string;
  isLoading?: boolean;
}

export class ImageUpload extends React.Component<ImageUploadProps, ImageUploadState> {
  public static defaultProps: ImageUploadProps = {
    useDefaultStyles: true,
    imageWidthLimit: 128,
    imageHeightLimit: 128,
    spinnerUrl: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    fileSizeLimit: Math.pow(1024, 2) // 1 MB
  };
  private components: {
    fileInput?: HTMLInputElement;
    image?: HTMLImageElement
  } = {};

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
              src={this.state.isLoading ? this.props.spinnerUrl : (this.state.imageData || this.props.defaultImageData)}
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

    if (file.size > this.props.fileSizeLimit) {
      console.log('Size is too big');
      return;
    }

    const imageData = URL.createObjectURL(file);
    this.onImageLoaded(imageData);
  }

  private onImageLoaded(imageData: any) {
    this.setState({
      isLoading: true
    });
    this.imageDataUrlToCanvas(imageData).then((imageDataUrlToCanvas: HTMLCanvasElement) => {
      const cropImageIntoSquareFromCenter = this.cropImageIntoSquareFromCenter(imageDataUrlToCanvas);
      const resizeImage = this.resizeImage(cropImageIntoSquareFromCenter, this.props.imageWidthLimit, this.props.imageHeightLimit);
      const toDataURL = resizeImage.toDataURL("image/png");
      this.setState({
        imageData: toDataURL,
        isLoading: false
      })
    })

  }

  private imageDataUrlToCanvas(imageDataUrl: string): Promise<HTMLCanvasElement> {
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      const image = document.createElement('img');
      image.src = imageDataUrl;

      image.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(image, 0, 0);

        resolve(canvas);
      };
    });
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