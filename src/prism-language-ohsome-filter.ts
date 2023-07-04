/**
 * Definition of tokens to match for usage with prism.js syntax-highlighter
 */

// quoted strings potentially with escaped values like double-quotes \" and backslashes \\
const QUOTED_KEYS_VALUES = '"(?:[^"\\\\]|\\\\.)*"';
// operators that can occur between tag-keys and tag-values
const TAG_OP = `\\s*(?:=|!=|\\s+in(?=\\s*\\())\\s*`;
// quoted keys, quoted values and operators between them
const QUOTED_TAGS = `((${QUOTED_KEYS_VALUES})(${TAG_OP})?)`;
// allowed chars in unquoted tags and values
const SIMPLE_TAG_CHARS = '[a-zA-Z_:-]';
const META_KEY = `(?:type|geometry|id|area|length|perimeter|geometry.vertices|geometry.outers|geometry.inners|geometry.roundness|geometry.squareness|changeset)\\s*:`;
export const PRISM_LANGUAGE_OHSOME_FILTER = {
  'quoted-tag': {
    pattern: new RegExp(QUOTED_TAGS),
    inside: {
      //key
      'quoted-key': {
        pattern: new RegExp(`${QUOTED_KEYS_VALUES}(?=${TAG_OP})`),
        alias: 'attr-name'
      },
      'operator': new RegExp(`^${TAG_OP}$`, 'm'),
    },
  },
  "boolean-op": {
    pattern: /\b(?:and|or|not)\b/gm,
    alias: "boolean"
  },
  "meta-key":{
    pattern: new RegExp(META_KEY, 'gm'),
    alias: 'keyword'
  },
  "unquoted-key": {
    pattern: new RegExp(`(${SIMPLE_TAG_CHARS}+|\\*)(?=${TAG_OP})`, 'gm'),
    alias: 'attr-name'
  },
  //operator after unquoted key
  "operator": new RegExp(`${TAG_OP}`,'mg'),
  'punctuation': /[(),]/
};

/// TEST STRINGS

const test = ` // TAGS
    // exact match
    natural=tree or natural = tree
    *=*
    "natural*^what🙈"="🙈ohno != erf = and or" or "natural or *^what🙈" = "🙈ohno != erf = and or"
    // any value
    natural=* and not "natürla"=*
    // special chars (:) in key
    addr:housenumber=*
    // not equals operator: exclude value(s)
    oneway!=yes or oneway != yes
    // match any in list
    highway in (residential, living_street)

    // METADATA
        // keys (
        // type, geometry, id, area, length, perimeter,
        // geometry.vertices, geometry.outers, geometry.inners, geometry.roundness, geometry.squareness
        // changeset
        // )

        // values (
        // for type: single value as node|way|relation
        type:node or type:way or type:relation or type : node
        // for geometry:
          // single value as point|line|polygon
          geometry:point or geometry:line or geometry:polygon or geometry : point
          // for id: single value as integer | [type]/integer
          id:1234 or id:node/1234 or id : 1234
        //         list of single values
        id:(1, 42, 1234) or id:(node/1, way/3)
        //         range of single values
        id:(1 .. 9999) or id:( .. 9999) or id:(1 ..) or id:(1..9999)
        // for area, length, perimeter: range of numbers
        area:(10 ..) or length:(10 ..) or perimeter:(10 ..)
        // for geometry.roundness, geometry.squareness: range of numbers
        geometry.roundness:(0.8 ..) or geometry.squareness:(0.8 ..)
        // for geometry.inners, geometry.outers: single value as number
        //                                       range of single values
        geometry.inners:0 or geometry.inners:(1 .. )
        geometry.outers:1 or geometry.outers:(2 .. )
        // for changeset: single value integer
        //                list
        //                range
        changeset:42 or changeset:(10, 42) or changeset:(10..42)
    `;

const test2 = `natural=tree or natural = tree or
*=*
"natural*^what🙈"="🙈ohno != erf = and or" or "natural or *^what🙈" = "🙈ohno != erf = and or"
or
"na\\"tural*^what🙈"="🙈ohno \\"abc\\\\!= erf = and or"
or
natural=* and not "natürla"=*

addr:housenumber=*

oneway!=yes or oneway != yes

highway in (residential, living_street)

type:node or type:way or type:relation or type : node

geometry:point or geometry:line or geometry:polygon or geometry : point

id:1234 or id:node/1234 or id : 1234

id:(1, 42, 1234) or id:(node/1, way/3)

id:(1 .. 9999) or id:( .. 9999) or id:(1 ..) or id:(1..9999)

area:(10 ..) or length:(10 ..) or perimeter:(10 ..)

geometry.roundness:(0.8 ..) or geometry.squareness:(0.8 ..)

geometry.inners:0 or geometry.inners:(1 .. )
geometry.outers:1 or geometry.outers:(2 .. )

changeset:42 or changeset:(10, 42) or changeset:(10..42)
`;
