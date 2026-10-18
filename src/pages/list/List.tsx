import './list.scss';
import PageIntro from '../../components/common/PageIntro';
import Datatable from '../../components/datatable/Datatable';

const List = () => {
  return (
    <div className="listPage">
      <PageIntro
        eyebrow="Operations roster"
        title="Manage users and monitor account health."
        description="Review activity, inspect statuses and keep your team list organized from one table."
      />
      <Datatable />
    </div>
  );
};

export default List;
