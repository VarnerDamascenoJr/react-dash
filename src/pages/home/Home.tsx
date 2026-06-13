import Chart from '../../components/chart/Chart';
import Featured from '../../components/featured/Feature';
import ListTable from '../../components/table/Table';
import Widget from '../../components/widgets/Widget';
import './home.scss';

const Home = () => {
  return (
    <div className="homePage">
      <section className="pageHero">
        <div>
          <span className="pageHero__eyebrow">Today at a glance</span>
          <h2>Revenue is up 18.4% across your strongest channels.</h2>
          <p>
            Keep an eye on conversions, customer health and fulfillment risk in
            one streamlined workspace.
          </p>
        </div>
        <div className="pageHero__badge">
          <strong>92%</strong>
          <span>target attainment this month</span>
        </div>
      </section>

      <div className="widgets">
        <Widget type="user" />
        <Widget type="order" />
        <Widget type="earnings" />
        <Widget type="balance" />
      </div>

      <div className="charts">
        <Featured />
        <Chart title="Last 6 Months Revenue Pulse" aspect={2 / 1} />
      </div>

      <div className="listContainer">
        <div className="listTitle">Latest Transactions</div>
        <ListTable />
      </div>
    </div>
  );
};

export default Home;
