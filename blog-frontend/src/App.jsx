import React, { useEffect, useState } from 'react';
import sanityClient from './sanity';
import { PortableText } from '@portabletext/react';

function App() {
  const [posts, setPosts] = useState([]);
  const [dark, setDark] = useState(true);
  const [expanded, setExpanded] = useState(null); // Track expanded post _id

  useEffect(() => {
    sanityClient.fetch(
      `*[_type == "post"]|order(publishedAt desc){
        _id,
        title,
        slug,
        mainImage{
          asset->{
            _id,
            url
          }
        },
        body,
        publishedAt,
        categories[]->{title},
        author->{name, image{asset->{url}}}
      }`
    ).then((data) => {
      setPosts(data);
    });
  }, []);

  const darkStyles = {
    background: '#18181b',
    color: '#f4f4f5',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
    transition: 'background 0.3s, color 0.3s',
    width: '100vw',
    boxSizing: 'border-box',
    padding: 0,
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
  };
  const lightStyles = {
    background: '#f9f9f9',
    color: '#222',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif',
    transition: 'background 0.3s, color 0.3s',
    width: '100vw',
    boxSizing: 'border-box',
    padding: 0,
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
  };

  return (
    <div style={dark ? darkStyles : lightStyles}>
      <button
        onClick={() => setDark((d) => !d)}
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 10,
          background: dark ? '#27272a' : '#e0e7ff',
          color: dark ? '#f4f4f5' : '#3730a3',
          border: 'none',
          borderRadius: 20,
          padding: '8px 18px',
          fontWeight: 600,
          fontSize: 16,
          boxShadow: '0 2px 8px #0002',
          cursor: 'pointer',
          transition: 'background 0.3s, color 0.3s',
        }}
      >
        {dark ? '🌙 Dark' : '☀️ Light'}
      </button>
      <h1 style={{ fontSize: 40, marginBottom: 32, textAlign: 'center', color: dark ? '#f4f4f5' : '#222', width: '100%' }}>Blog Posts</h1>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 1vw', boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap', gap: '2vw', justifyContent: 'center' }}>
        {posts.length === 0 && <p>Loading...</p>}
        {posts.map(post => {
          const isExpanded = expanded === post._id;
          return (
            <div
              key={post._id}
              onClick={() => setExpanded(isExpanded ? null : post._id)}
              style={{
                cursor: 'pointer',
                margin: '0 0 32px 0',
                background: dark ? '#23232a' : '#fff',
                borderRadius: 16,
                boxShadow: isExpanded ? '0 4px 32px #0006' : '0 2px 8px #0002',
                padding: isExpanded ? '3vw 4vw' : '1.5vw 2vw',
                transition: 'all 0.3s',
                maxWidth: isExpanded ? '900px' : '350px',
                width: isExpanded ? '90vw' : '350px',
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: isExpanded ? 2 : 1,
                flex: isExpanded ? '1 1 900px' : '1 1 350px',
                minHeight: isExpanded ? 400 : 320,
                overflow: 'hidden',
                border: isExpanded ? `2px solid ${dark ? '#6366f1' : '#3730a3'}` : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              {post.mainImage && post.mainImage.asset && (
                <img
                  src={post.mainImage.asset.url}
                  alt={post.title}
                  style={{
                    width: '100%',
                    maxHeight: isExpanded ? 400 : 180,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginBottom: 16,
                    boxShadow: dark ? '0 2px 8px #0006' : '0 2px 8px #0001',
                    display: 'block',
                    transition: 'max-height 0.3s',
                  }}
                />
              )}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                {post.author?.image?.asset?.url && (
                  <img
                    src={post.author.image.asset.url}
                    alt={post.author.name}
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 10, border: dark ? '2px solid #6366f1' : '2px solid #e0e7ff', background: '#fff' }}
                  />
                )}
                <span style={{ fontWeight: 500, color: dark ? '#d4d4d8' : '#555' }}>{post.author?.name}</span>
                <span style={{ margin: '0 8px', color: dark ? '#71717a' : '#aaa' }}>•</span>
                <span style={{ color: dark ? '#a1a1aa' : '#888' }}>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
              </div>
              <h2 style={{ fontSize: 24, margin: '8px 0 8px 0', color: dark ? '#f4f4f5' : '#333', textAlign: 'left' }}>{post.title}</h2>
              <div style={{ marginBottom: 8 }}>
                {post.categories && post.categories.map(cat => (
                  <span
                    key={cat.title}
                    style={{
                      background: dark ? '#3730a3' : '#e0e7ff',
                      color: dark ? '#e0e7ff' : '#3730a3',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontSize: 13,
                      marginRight: 6,
                      fontWeight: 500,
                      letterSpacing: 0.2,
                    }}
                  >
                    {cat.title}
                  </span>
                ))}
              </div>
              <div style={{ color: dark ? '#d4d4d8' : '#444', fontSize: 16, lineHeight: 1.7, marginTop: 8, maxHeight: isExpanded ? 'none' : 80, overflow: isExpanded ? 'visible' : 'hidden', textOverflow: 'ellipsis' }}>
                <PortableText value={post.body} />
              </div>
              {!isExpanded && (
                <div style={{ textAlign: 'right', marginTop: 12 }}>
                  <span style={{ color: dark ? '#6366f1' : '#3730a3', fontWeight: 600, fontSize: 15 }}>Read more...</span>
                </div>
              )}
              {isExpanded && (
                <button
                  onClick={e => { e.stopPropagation(); setExpanded(null); }}
                  style={{
                    marginTop: 18,
                    alignSelf: 'flex-end',
                    background: dark ? '#3730a3' : '#e0e7ff',
                    color: dark ? '#e0e7ff' : '#3730a3',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 18px',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #0002',
                  }}
                >
                  Close
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
