import TableComponent from "@/app/components/table/Table";
import ContentWrapper from "@/app/components/ContentWrapper";

const MangasTable = ({ mangas }) => {
  return (
    <ContentWrapper>
      <div className="pt-12">
        <TableComponent data={mangas} />
      </div>
    </ContentWrapper>
  );
};

export default MangasTable;
