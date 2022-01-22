  <<<<<<< organize-folders
const { request, logger } = require("../common/utils");
  =======
const { request, logger, CustomError } = require("../common/utils");
  >>>>>>> master
const axios = require("axios");
const retryer = require("../common/retryer");
const calculateRank = require("../calculateRank");
const githubUsernameRegex = require("github-username-regex");

require("dotenv").config();

const fetcher = (variables, token) => {
  return request(
    {
      query: `
      query userInfo($login: String!) {
        user(login: $login) {
          name
          login
          contributionsCollection {
            totalCommitContributions
            restrictedContributionsCount
          }
          repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
            totalCount
          }
          pullRequests(first: 1) {
            totalCount
          }
          issues(first: 1) {
            totalCount
          }
          followers {
            totalCount
          }
  <<<<<<< organize-folders
          repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {direction: DESC, field: STARGAZERS}) {
  =======
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}) {
  >>>>>>> master
            totalCount
            nodes {
              stargazers {
                totalCount
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
  =======
    },
  >>>>>>> master
  );
};

// https://github.com/anuraghazra/github-readme-stats/issues/92#issuecomment-661026467
// https://github.com/anuraghazra/github-readme-stats/pull/211/
const totalCommitsFetcher = async (username) => {
  if (!githubUsernameRegex.test(username)) {
    logger.log("Invalid username");
    return 0;
  }

  // https://developer.github.com/v3/search/#search-commits
  const fetchTotalCommits = (variables, token) => {
    return axios({
      method: "get",
      url: `https://api.github.com/search/commits?q=author:${variables.login}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.cloak-preview",
        Authorization: `bearer ${token}`,
      },
    });
  };

  try {
    let res = await retryer(fetchTotalCommits, { login: username });
    if (res.data.total_count) {
      return res.data.total_count;
    }
  } catch (err) {
    logger.log(err);
    // just return 0 if there is something wrong so that
    // we don't break the whole app
    return 0;
  }
};

async function fetchStats(
  username,
  count_private = false,
  <<<<<<< organize-folders
  include_all_commits = false
  =======
  include_all_commits = false,
  >>>>>>> master
) {
  if (!username) throw Error("Invalid username");

  const stats = {
    name: "",
    totalPRs: 0,
    totalCommits: 0,
    totalIssues: 0,
    totalStars: 0,
    contributedTo: 0,
    rank: { level: "C", score: 0 },
  };

  let res = await retryer(fetcher, { login: username });

  <<<<<<< organize-folders
  let experimental_totalCommits = 0;
  if (include_all_commits) {
    experimental_totalCommits = await totalCommitsFetcher(username);
  }

  if (res.data.errors) {
    logger.error(res.data.errors);
    throw Error(res.data.errors[0].message || "Could not fetch user");
  }

  const user = res.data.data.user;
  const contributionCount = user.contributionsCollection;
  =======
  if (res.data.errors) {
    logger.error(res.data.errors);
    throw new CustomError(
      res.data.errors[0].message || "Could not fetch user",
      CustomError.USER_NOT_FOUND,
    );
  }

  const user = res.data.data.user;
  >>>>>>> master

  stats.name = user.name || user.login;
  stats.totalIssues = user.issues.totalCount;

  <<<<<<< organize-folders
  stats.totalCommits =
    contributionCount.totalCommitContributions + experimental_totalCommits;

  if (count_private) {
    stats.totalCommits += contributionCount.restrictedContributionsCount;
  =======
  // normal commits
  stats.totalCommits = user.contributionsCollection.totalCommitContributions;

  // if include_all_commits then just get that,
  // since totalCommitsFetcher already sends totalCommits no need to +=
  if (include_all_commits) {
    stats.totalCommits = await totalCommitsFetcher(username);
  }

  // if count_private then add private commits to totalCommits so far.
  if (count_private) {
    stats.totalCommits +=
      user.contributionsCollection.restrictedContributionsCount;
  >>>>>>> master
  }

  stats.totalPRs = user.pullRequests.totalCount;
  stats.contributedTo = user.repositoriesContributedTo.totalCount;

  stats.totalStars = user.repositories.nodes.reduce((prev, curr) => {
    return prev + curr.stargazers.totalCount;
  }, 0);

  stats.rank = calculateRank({
    totalCommits: stats.totalCommits,
    totalRepos: user.repositories.totalCount,
    followers: user.followers.totalCount,
    contributions: stats.contributedTo,
    stargazers: stats.totalStars,
    prs: stats.totalPRs,
    issues: stats.totalIssues,
  });

  return stats;
}

module.exports = fetchStats;
