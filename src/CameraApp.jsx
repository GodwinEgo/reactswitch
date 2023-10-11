import React, { Component } from "react";

class CameraApp extends Component {
  state = {
    stream: null,
    activeCamera: "user", // 'user' for front, 'environment' for rear
  };

  async getCameraStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.state.activeCamera },
      });
      this.setState({ stream });
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }

  toggleCamera = () => {
    const newCamera =
      this.state.activeCamera === "user" ? "environment" : "user";
    this.setState({ activeCamera: newCamera }, () => {
      this.closeCamera();
      this.getCameraStream();
    });
  };

  componentDidMount() {
    this.getCameraStream();
  }

  componentWillUnmount() {
    this.closeCamera();
  }

  closeCamera() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  render() {
    const { stream } = this.state;

    return (
      <div>
        <h1>Camera App</h1>
        <button onClick={this.toggleCamera}>Switch Camera</button>
        {stream && <video autoPlay ref={(video) => (this.video = video)} />}
      </div>
    );
  }
}

export default CameraApp;
