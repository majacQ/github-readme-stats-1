  <<<<<<< organize-folders
const { request, logger } = require("../common/utils");
  =======
const { request, logger, clampValue } = require("../common/utils");
  >>>>>>> master
const retryer = require("../common/retryer");
require("dotenv").config();

const fetcher = (variables, token) => {
  return request(
    {
      query: `
      query userInfo($login: String!) {
        user(login: $login) {
          # fetch only owner repos & not forks
          repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
            nodes {
  <<<<<<< organize-folders
  =======
              name
  >>>>>>> master
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    color
                    name
                  }
                }
              }
            }
          }
        }
      }
      `,
      variables,
    },
    {
      Authorization: `bearer ${token}`,
  <<<<<<< organize-folders
    }
  );
};

async function fetchTopLanguages(username) {
  if (!username) throw Error("Invalid username");

  let res = await retryer(fetcher, { login: username });
  =======
    },
  );
};

async function fetchTopLanguages(username, langsCount = 5, exclude_repo = []) {
  if (!username) throw Error("Invalid username");

  langsCount = clampValue(parseInt(langsCount), 1, 10);

  const res = await retryer(fetcher, { login: username });
  >>>>>>> master

  if (res.data.errors) {
    logger.error(res.data.errors);
    throw Error(res.data.errors[0].message || "Could not fetch user");
  }

  let repoNodes = res.data.data.user.repositories.nodes;
  <<<<<<< organize-folders
  =======
  let repoToHide = {};

  // populate repoToHide map for quick lookup
  // while filtering out
  if (exclude_repo) {
    exclude_repo.forEach((repoName) => {
      repoToHide[repoName] = true;
    });
  }

  // filter out repositories to be hidden
  repoNodes = repoNodes
    .sort((a, b) => b.size - a.size)
    .filter((name) => {
      return !repoToHide[name.name];
    });
  >>>>>>> master

  repoNodes = repoNodes
    .filter((node) => {
      return node.languages.edges.length > 0;
    })
    // flatten the list of language nodes
    .reduce((acc, curr) => curr.languages.edges.concat(acc), [])
  <<<<<<< organize-folders
    .sort((a, b) => b.size - a.size)
  =======
  >>>>>>> master
    .reduce((acc, prev) => {
      // get the size of the language (bytes)
      let langSize = prev.size;

      // if we already have the language in the accumulator
      // & the current language name is same as previous name
      // add the size to the language size.
      if (acc[prev.node.name] && prev.node.name === acc[prev.node.name].name) {
        langSize = prev.size + acc[prev.node.name].size;
      }
      return {
        ...acc,
        [prev.node.name]: {
          name: prev.node.name,
          color: prev.node.color,
          size: langSize,
        },
      };
    }, {});

  const topLangs = Object.keys(repoNodes)
  <<<<<<< organize-folders
    .slice(0, 5)
  =======
    .sort((a, b) => repoNodes[b].size - repoNodes[a].size)
    .slice(0, langsCount)
  >>>>>>> master
    .reduce((result, key) => {
      result[key] = repoNodes[key];
      return result;
    }, {});

  return topLangs;
}

module.exports = fetchTopLanguages;
