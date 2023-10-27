module.exports = (md) => ({ src, alt, caption = '' }) => `
  <figure>
    <div>
      <img src="${src}" alt="${alt}" />
    </div>
    ${caption ? `<figcaption>${md.renderInline(caption)}</figcaption>` : ''}
  </figure>
`