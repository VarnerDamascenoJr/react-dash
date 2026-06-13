import './single.scss';
import Chart from '../../components/chart/Chart';
import ListTable from '../../components/table/Table';

const Single = () => {
  return (
    <div className="singlePage">
      <section className="pageIntro">
        <div>
          <span className="pageIntro__eyebrow">Profile deep dive</span>
          <h2>Relationship and performance snapshot.</h2>
        </div>
        <p>
          Review core details, spending behavior and the most recent account
          activity.
        </p>
      </section>

      <div className="singlePage__top">
        <div className="profileCard">
          <button type="button" className="editButton">
            Edit profile
          </button>
          <h3 className="title">Contact Information</h3>
          <div className="item">
            <img
              src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
              alt="Jane Doe"
              className="itemImg"
            />
            <div className="details">
              <h1 className="itemTitle">Jane Doe</h1>
              <div className="detailItem">
                <span className="itemKey">Email</span>
                <span className="itemValue">janedoe@gmail.com</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Phone</span>
                <span className="itemValue">+21 2323 44 44</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Address</span>
                <span className="itemValue">Elton St. Garden</span>
              </div>
              <div className="detailItem">
                <span className="itemKey">Country</span>
                <span className="itemValue">USA</span>
              </div>
            </div>
          </div>
        </div>
        <div className="singlePage__chart">
          <Chart aspect={3 / 1} title="User Spending Last 6 Months" />
        </div>
      </div>

      <div className="singlePage__bottom">
        <h3 className="title">Last Transactions</h3>
        <ListTable />
      </div>
    </div>
  );
};

export default Single;
