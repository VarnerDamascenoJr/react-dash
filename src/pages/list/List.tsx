import './list.scss';
import Datatable from '../../components/datatable/Datatable';

const List = () => {
  return (
    <div className="listPage">
      <section className="pageIntro">
        <div>
          <span className="pageIntro__eyebrow">Operations roster</span>
          <h2>Manage users and monitor account health.</h2>
        </div>
        <p>
          Review activity, inspect statuses and keep your team list organized
          from one table.
        </p>
      </section>
      <Datatable />
    </div>
  );
};

export default List;
