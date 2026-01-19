export default function VideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        <source
          src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
