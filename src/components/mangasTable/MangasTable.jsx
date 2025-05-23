import TableComponent from '@/components/table/Table';
import ContentWrapper from '@/components/ContentWrapper';

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
