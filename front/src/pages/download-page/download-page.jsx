import deleteConfig from "../../services/delete-config";

const DownloadPage = () => {
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
          id: "81d827f0-2cd4-41ef-912a-e1a89bd8b429",
          password: "Qwerty123!",
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
    deleteConfig("81d827f0-2cd4-41ef-912a-e1a89bd8b429");
  };

  return (
    <div className="downloadPage">
      <div onClick={downloadConfig}>hello</div>
    </div>
  );
};

export default DownloadPage;
