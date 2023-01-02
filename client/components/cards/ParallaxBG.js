const ParallaxBG = ({ url, children = "StayConnected" }) => {
  return (
    <div
      className="bg-default-image"
      style={{
        backgroundImage: "url( " + url + " )",
        backgroundAttachment: "fixed",
        
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        display: "block",
      }}
    >
      <h1 className="display-1 font-weight-bold text-center text-lg-center">
        {children}
      </h1>
    </div>
  );
};

export default ParallaxBG;
