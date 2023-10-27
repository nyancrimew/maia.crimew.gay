module.exports = (md) => async ({ src, alt, caption = '', type = 'img' }) => `
  <figure>
    <div>
    ${
      type == 'video' ? 
`<video controls onloadstart="this.volume=0.5">
  <source src="${src}" type="video/mp4">
</video>` : `<img src="${src}" alt="${alt}" />`
    }
    </div>
    ${caption ? `<figcaption>${md.renderInline(caption)}</figcaption>` : ''}
  </figure>
`