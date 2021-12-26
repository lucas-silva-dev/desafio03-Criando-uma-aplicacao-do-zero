/* eslint-disable react/no-danger */
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { formatDate } from '../../utils/formatDate';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const text = post.data.content.reduce((amount, content) => {
    const newAmount = RichText.asText(content.body).split(/\s/g);

    const words = amount + newAmount;

    return words;
  }, '');

  const totalCount = Math.ceil(text.split(',').length / 200);

  return router.isFallback ? (
    <h1>Carregando...</h1>
  ) : (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <main className={commonStyles.container}>
        {post.data.banner.url && (
          <section className={styles.bannerWrapper}>
            <div className={styles.postBanner}>
              <img src={post.data.banner.url} alt="banner" />
            </div>
          </section>
        )}

        <article className={styles.post}>
          <header>
            <h1>{post.data.title}</h1>

            <div>
              <time>
                <FiCalendar />
                {formatDate(post?.first_publication_date || '')}
              </time>
              <span>
                <FiUser />
                {post.data.author}
              </span>

              <span>
                <FiClock />
                {totalCount} min
              </span>
            </div>
          </header>

          {post.data.content.map(content => (
            <section
              className={styles.postContent}
              key={content.heading + Math.random()}
            >
              <strong>{content.heading}</strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </section>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [],
    }
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  // { params: { slug: 'past-present-and-future-of-react-state-management' } },
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url || null,
      },
      author: response.data.author,
      content: [...response.data.content],
    },
  };

  return {
    props: { post },
  };
};
