const PostImage = ({ url }) => (
  <div
    style={{
      backgroundImage: "url(" + url + ")",
      alignContent: "center",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",

      //backgroundSize: "cover",
      //maxHeight: "300px",
      //maxWidth: "300px",
      
      height: "300px",
      width: "100%",
      //maxHeight: "50%",
      //maxWidth: "50%",
      //display: "block",
      //marginLeft: "auto",
      //marginRight: "auto",
    }}
  ></div>
);

export default PostImage;
