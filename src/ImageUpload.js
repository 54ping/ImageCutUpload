import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'antd';
import Cropper from 'react-cropper' // 引入Cropper
import 'cropperjs/dist/cropper.css' // 引入Cropper对应的css
import './ImageUpload.scss'
import 'antd/dist/antd.css'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 文件最大限制为5M

class ClassCropperModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      src: null
    }
  }

  componentDidMount() {
    const fileReader = new FileReader()
    fileReader.onload = e => {
      const dataURL = e.target.result
      this.setState({ src: dataURL })
    }

    fileReader.readAsDataURL(this.props.uploadedImageFile)
  }

  handleSubmit = () => {
    if (!this.state.submitting) {
      // let url = `/homepage_images` // 你要上传的url
      // 拿到文件名
      // let filename = this.props.uploadedImageFile.name

      console.log('正在上传图片')
      // TODO: 这里可以尝试修改上传图片的尺寸
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // // 创造提交表单数据对象
        // const formData = new FormData()
        // // 添加要上传的文件
        // formData.append('file', blob, filename)
        // 提示开始上传 (因为demo没有后端server, 所以这里代码我注释掉了, 这里是上传到服务器并拿到返回数据的代码)
        // this.setState({submitting: true})
        // 上传图片
        // const resp = await http.post(url, formData)
        // 拿到服务器返回的数据(resp)
        // console.log(resp)
        // 提示上传完毕
        // this.setState({submitting: false})

        //把选中裁切好的的图片传出去
        this.props.onSubmit(blob);

        // 关闭弹窗
        this.props.onClose()
      })
    }
  }

  render() {
    return (
      <div className="class-cropper-modal">
        <div className="modal-panel">
          <div className="cropper-container-container">
            <div className="cropper-container">
              <Cropper
                src={this.state.src}
                className="cropper"
                ref={cropper => (this.cropper = cropper)}
                // Cropper.js options
                viewMode={1}
                zoomable={false}
                aspectRatio={1.6} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
                guides={false}
                preview=".cropper-preview"
              />
            </div>
            <div className="preview-container">
              <div className="cropper-preview" />
            </div>
          </div>
          <div className="button-row">
            <Button>取消</Button>
            <Button onClick={this.handleSubmit} type="primary">提交</Button>
          </div>
        </div>
      </div> 
    )
  }
}

ClassCropperModal.propTypes = {
  uploadedImageFile: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

class ImageUpload extends Component {
  state = {
    classModalVisible: false,
    classModalFile: null,
    classResultImgUrl: null,
  }

  handleClassFileChange = e => {
    const file = e.target.files[0]

    if (file) {
      if (file.size <= MAX_FILE_SIZE) {
        this.setState(
          {
            classModalFile: file // 先把上传的文件暂存在state中
          },
          () => {
            this.setState({
              classModalVisible: true // 然后弹出modal
            })
          }
        )
      } else {
        console.log('文件过大')
      }
    }
  }

  handleGetResultImgUrl = key => blob => {
    const str = URL.createObjectURL(blob)
    this.setState({
      [key]: str
    })
  }

  render() {
    const {
      classModalVisible,
      classModalFile,
      classResultImgUrl,
    } = this.state
    return (
      <div className="app">
        <div className="half-area">
          <label className="upload-input-label">
            <div className="img-container">
              {classResultImgUrl && (
                <img
                  className="img"
                  src={classResultImgUrl}
                  alt="classResultImgUrl"
                />
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className="base-upload-input"
              onChange={this.handleClassFileChange}
            />
          </label>
          
        </div>

        {classModalVisible && (
          <ClassCropperModal
            uploadedImageFile={classModalFile}
            onClose={() => {
              this.setState({ classModalVisible: false })
            }}
            onSubmit={this.handleGetResultImgUrl('classResultImgUrl')}
          />
        )}
      </div>
    )
  }
}

export default ImageUpload
