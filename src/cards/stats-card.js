  <<<<<<< organize-folders
const {
  kFormatter,
  getCardColors,
  FlexLayout,
  encodeHTML,
} = require("../common/utils");
const { getStyles } = require("../getStyles");
const icons = require("../common/icons");
const Card = require("../common/Card");
  =======
const I18n = require("../common/I18n");
const Card = require("../common/Card");
const icons = require("../common/icons");
const { getStyles } = require("../getStyles");
const { statCardLocales } = require("../translations");
const {
  kFormatter,
  FlexLayout,
  clampValue,
  measureText,
  getCardColors,
} = require("../common/utils");
  >>>>>>> master

const createTextNode = ({
  icon,
  label,
  value,
  id,
  index,
  showIcons,
  shiftValuePos,
}) => {
  const kValue = kFormatter(value);
  const staggerDelay = (index + 3) * 150;

  const labelOffset = showIcons ? `x="25"` : "";
  const iconSvg = showIcons
    ? `
    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
      ${icon}
    </svg>
  `
    : "";
  return `
    <g class="stagger" style="animation-delay: ${staggerDelay}ms" transform="translate(25, 0)">
      ${iconSvg}
      <text class="stat bold" ${labelOffset} y="12.5">${label}:</text>
      <text 
        class="stat" 
  <<<<<<< organize-folders
        x="${shiftValuePos ? (showIcons ? 200 : 170) : 150}" 
  =======
        x="${(showIcons ? 140 : 120) + shiftValuePos}" 
  >>>>>>> master
        y="12.5" 
        data-testid="${id}"
      >${kValue}</text>
    </g>
  `;
};

const renderStatsCard = (stats = {}, options = { hide: [] }) => {
  const {
    name,
    totalStars,
    totalCommits,
    totalIssues,
    totalPRs,
    contributedTo,
    rank,
  } = stats;
  const {
    hide = [],
    show_icons = false,
    hide_title = false,
    hide_border = false,
    hide_rank = false,
    include_all_commits = false,
    line_height = 25,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme = "default",
  <<<<<<< organize-folders
  =======
    custom_title,
    locale,
    disable_animations = false,
  >>>>>>> master
  } = options;

  const lheight = parseInt(line_height, 10);

  // returns theme based colors with proper overrides and defaults
  const { titleColor, textColor, iconColor, bgColor } = getCardColors({
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
  });

  <<<<<<< organize-folders
  =======
  const apostrophe = ["x", "s"].includes(name.slice(-1).toLocaleLowerCase())
    ? ""
    : "s";
  const i18n = new I18n({
    locale,
    translations: statCardLocales({ name, apostrophe }),
  });

  >>>>>>> master
  // Meta data for creating text nodes with createTextNode function
  const STATS = {
    stars: {
      icon: icons.star,
  <<<<<<< organize-folders
      label: "Total Stars",
  =======
      label: i18n.t("statcard.totalstars"),
  >>>>>>> master
      value: totalStars,
      id: "stars",
    },
    commits: {
      icon: icons.commits,
  <<<<<<< organize-folders
      label: `Total Commits${
=======
      label: `${i18n.t("statcard.commits")}${
  >>>>>>> master
        include_all_commits ? "" : ` (${new Date().getFullYear()})`
      }`,
      value: totalCommits,
      id: "commits",
    },
    prs: {
      icon: icons.prs,
  <<<<<<< organize-folders
      label: "Total PRs",
  =======
      label: i18n.t("statcard.prs"),
  >>>>>>> master
      value: totalPRs,
      id: "prs",
    },
    issues: {
      icon: icons.issues,
  <<<<<<< organize-folders
      label: "Total Issues",
  =======
      label: i18n.t("statcard.issues"),
  >>>>>>> master
      value: totalIssues,
      id: "issues",
    },
    contribs: {
      icon: icons.contribs,
  <<<<<<< organize-folders
      label: "Contributed to",
  =======
      label: i18n.t("statcard.contribs"),
  >>>>>>> master
      value: contributedTo,
      id: "contribs",
    },
  };

  <<<<<<< organize-folders
  =======
  const longLocales = ["cn", "es", "fr", "pt-br", "ru", "uk-ua", "id", "my", "pl"];
  const isLongLocale = longLocales.includes(locale) === true;

  >>>>>>> master
  // filter out hidden stats defined by user & create the text nodes
  const statItems = Object.keys(STATS)
    .filter((key) => !hide.includes(key))
    .map((key, index) =>
      // create the text nodes, and pass index so that we can calculate the line spacing
      createTextNode({
        ...STATS[key],
        index,
        showIcons: show_icons,
  <<<<<<< organize-folders
        shiftValuePos: !include_all_commits,
      })
  =======
        shiftValuePos:
          (!include_all_commits ? 50 : 20) + (isLongLocale ? 50 : 0),
      }),
  >>>>>>> master
    );

  // Calculate the card height depending on how many items there are
  // but if rank circle is visible clamp the minimum height to `150`
  let height = Math.max(
    45 + (statItems.length + 1) * lheight,
  <<<<<<< organize-folders
    hide_rank ? 0 : 150
  =======
    hide_rank ? 0 : 150,
  >>>>>>> master
  );

  // Conditionally rendered elements
  const rankCircle = hide_rank
    ? ""
    : `<g data-testid="rank-circle" 
          transform="translate(400, ${height / 2 - 50})">
        <circle class="rank-circle-rim" cx="-10" cy="8" r="40" />
        <circle class="rank-circle" cx="-10" cy="8" r="40" />
        <g class="rank-text">
          <text
            x="${rank.level.length === 1 ? "-4" : "0"}"
            y="0"
            alignment-baseline="central"
            dominant-baseline="central"
            text-anchor="middle"
          >
            ${rank.level}
          </text>
        </g>
      </g>`;

  // the better user's score the the rank will be closer to zero so
  // subtracting 100 to get the progress in 100%
  const progress = 100 - rank.score;
  const cssStyles = getStyles({
    titleColor,
    textColor,
    iconColor,
    show_icons,
    progress,
  });

  <<<<<<< organize-folders
  const apostrophe = ["x", "s"].includes(name.slice(-1)) ? "" : "s";
  const card = new Card({
    title: `${encodeHTML(name)}'${apostrophe} GitHub Stats`,
    width: 495,
  =======
  const calculateTextWidth = () => {
    return measureText(custom_title ? custom_title : i18n.t("statcard.title"));
  };

  const width = hide_rank
    ? clampValue(
        50 /* padding */ + calculateTextWidth() * 2,
        270 /* min */,
        Infinity,
      )
    : 495;

  const card = new Card({
    customTitle: custom_title,
    defaultTitle: i18n.t("statcard.title"),
    width,
  >>>>>>> master
    height,
    colors: {
      titleColor,
      textColor,
      iconColor,
      bgColor,
    },
  });

  card.setHideBorder(hide_border);
  card.setHideTitle(hide_title);
  card.setCSS(cssStyles);

  <<<<<<< organize-folders
  =======
  if (disable_animations) card.disableAnimations();

  >>>>>>> master
  return card.render(`
    ${rankCircle}

    <svg x="0" y="0">
      ${FlexLayout({
        items: statItems,
        gap: lheight,
        direction: "column",
      }).join("")}
    </svg> 
  `);
};

module.exports = renderStatsCard;
