import Image from 'next/image';
import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={commonStyles.container}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <Image src="/images/logo.svg" alt="logo" width={239} height={26} />
          </a>
        </Link>
      </div>
    </header>
  );
}
