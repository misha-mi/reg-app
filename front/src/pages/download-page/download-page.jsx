import deleteConfig from "../../services/delete-config";

const DownloadPage = ({ password, id }) => {
  const downloadConfig = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/getConfig`,
      {
        method: "POST",
        headers: {
          withCredentials: true,
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          id,
          password,
        }),
      }
    );

    if (response.status === 200) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "cfg.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    deleteConfig(id);
  };
  const buttonLoad = <div onClick={downloadConfig}>hello</div>;

  return <div className="downloadPage">{buttonLoad}</div>;
};

export default DownloadPage;
