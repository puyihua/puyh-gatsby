const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    // create the partial URL
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    // attached the slug with existing graphQL node
    // in other words : insert the data into DB
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}
exports.createPages = async ({ graphql, actions }) => {
  // return a Promise
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })

}
