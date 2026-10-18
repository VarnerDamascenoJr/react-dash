import './list.scss';
import { useTranslation } from 'react-i18next';
import PageIntro from '../../components/common/layout/PageIntro';
import Datatable from '../../components/datatable/Datatable';

const List = () => {
  const { t } = useTranslation('list');

  return (
    <div className="listPage">
      <PageIntro
        eyebrow={t('header.eyebrow')}
        title={t('header.title')}
        description={t('header.description')}
      />
      <Datatable />
    </div>
  );
};

export default List;
