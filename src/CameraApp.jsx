import React, { Component } from "react";

class CameraApp extends Component {
  state = {
    stream: null,
    activeCamera: "user", // 'user' for front, 'environment' for rear
    error: null,
  };

  videoRef = React.createRef();

  async getCameraStream() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices.length === 0) {
        this.setState({ error: "No cameras found" });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.state.activeCamera },
      });

      this.setState({ stream, error: null }, () => {
        if (this.videoRef.current) {
          this.videoRef.current.srcObject = stream;
        }
      });
    } catch (error) {
      this.setState({ error: "Error accessing camera" });
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
    const { stream, error } = this.state;

    return (
      <div>
        <h1>Camera App</h1>
        {error ? (
          <p>{error}</p>
        ) : (
          <div>
            <button onClick={this.toggleCamera}>Switch Camera</button>
            {stream && <video autoPlay ref={this.videoRef} />}
          </div>
        )}
      </div>
    );
  }
}

export default CameraApp;
