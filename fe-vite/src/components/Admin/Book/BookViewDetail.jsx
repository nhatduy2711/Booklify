import { Drawer, Badge, Descriptions, Image } from "antd";
import moment from "moment";
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";
import { useEffect, useState } from "react";

const BookViewDetail = (props) => {
  const [drawerWidth, setDrawerWidth] = useState("50vw");

  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1300;
      setDrawerWidth(isMobile ? "100vw" : "50vw");
    };

    handleResize(); // Gọi lần đầu

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const baseImageURL = `${import.meta.env.VITE_BACKEND_URL}/images/book`;

  return (
    <Drawer
      title="Chi tiết sách"
      width={drawerWidth}
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin sách" bordered column={1}>
        <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
        <Descriptions.Item label="Tên sách">
          {dataViewDetail?.mainText}
        </Descriptions.Item>

        <Descriptions.Item label="Tác giả">
          {dataViewDetail?.author}
        </Descriptions.Item>
        <Descriptions.Item label="Thể loại">
          {dataViewDetail?.category}
        </Descriptions.Item>

        <Descriptions.Item label="Giá tiền">
          {dataViewDetail?.price?.toLocaleString()} VNĐ
        </Descriptions.Item>
        <Descriptions.Item label="Đã bán">
          {dataViewDetail?.sold}
        </Descriptions.Item>

        <Descriptions.Item label="Tồn kho">
          <Badge
            status={dataViewDetail?.quantity > 0 ? "success" : "error"}
            text={`${dataViewDetail?.quantity} quyển`}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {moment(dataViewDetail?.createdAt).format(FORMAT_DATE_DISPLAY)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {moment(dataViewDetail?.updatedAt).format(FORMAT_DATE_DISPLAY)}
        </Descriptions.Item>

        {dataViewDetail?.thumbnail && (
          <Descriptions.Item label="Ảnh bìa" span={2}>
            <Image
              width={150}
              src={`${baseImageURL}/${dataViewDetail.thumbnail}`}
              alt="Ảnh sách"
              style={{ border: "1px solid #ccc", padding: 4 }}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
    </Drawer>
  );
};

export default BookViewDetail;
