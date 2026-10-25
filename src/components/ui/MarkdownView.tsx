import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextStyle,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';
import { ThemeColors } from './theme';
import {
  tokenizeInline,
  parseBlocks,
  InlineToken,
  Block,
} from './markdownParser';

export { tokenizeInline, parseBlocks, InlineToken, Block };

export interface MarkdownViewProps {
  content: string;
  isUser?: boolean;
  baseColor?: keyof ThemeColors;
  style?: ViewStyle;
}

export function MarkdownView({
  content,
  isUser = false,
  baseColor = isUser ? 'primaryForeground' : 'foreground',
  style,
}: MarkdownViewProps) {
  const { colors, theme } = useTheme();
  const textColor = colors[baseColor] ?? colors.foreground;

  const renderInline = (text: string, baseStyle?: TextStyle) => {
    const tokens = tokenizeInline(text);
    return tokens.map((token, index) => {
      switch (token.type) {
        case 'bold_italic':
          return (
            <Text
              key={index}
              style={[
                baseStyle,
                {
                  fontWeight: '700',
                  fontStyle: 'italic',
                  color: isUser ? colors.primaryForeground : colors.foreground,
                },
              ]}
            >
              {token.text}
            </Text>
          );
        case 'bold':
          return (
            <Text
              key={index}
              style={[
                baseStyle,
                {
                  fontWeight: '700',
                  color: isUser ? colors.primaryForeground : colors.foreground,
                },
              ]}
            >
              {token.text}
            </Text>
          );
        case 'italic':
          return (
            <Text
              key={index}
              style={[
                baseStyle,
                {
                  fontStyle: 'italic',
                  color: isUser ? colors.primaryForeground : colors.foregroundMuted,
                },
              ]}
            >
              {token.text}
            </Text>
          );
        case 'code':
          return (
            <Text
              key={index}
              style={[
                baseStyle,
                {
                  fontFamily: Platform.select({
                    ios: 'Menlo',
                    android: 'monospace',
                    default: 'monospace',
                  }),
                  backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : colors.surfaceSubtle,
                  color: isUser ? colors.primaryForeground : colors.primary,
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  borderRadius: 4,
                  fontWeight: '600',
                  fontSize: 13,
                },
              ]}
            >
              {` ${token.text} `}
            </Text>
          );
        case 'strikethrough':
          return (
            <Text
              key={index}
              style={[
                baseStyle,
                {
                  textDecorationLine: 'line-through',
                  color: colors.foregroundSubtle,
                },
              ]}
            >
              {token.text}
            </Text>
          );
        case 'link':
          return (
            <Text
              key={index}
              style={[
                baseStyle,
                {
                  color: isUser ? colors.primaryForeground : colors.primary,
                  textDecorationLine: 'underline',
                  fontWeight: '600',
                },
              ]}
            >
              {token.text}
            </Text>
          );
        default:
          return (
            <Text key={index} style={baseStyle}>
              {token.text}
            </Text>
          );
      }
    });
  };

  const blocks = parseBlocks(content || '');

  return (
    <View style={[styles.container, style]}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <View key={idx} style={styles.h1Wrapper}>
                <Text
                  style={[
                    styles.h1,
                    {
                      color: isUser ? colors.primaryForeground : colors.foreground,
                      lineHeight: 28,
                    },
                  ]}
                >
                  {renderInline(block.content || '', { fontWeight: '700' })}
                </Text>
              </View>
            );

          case 'h2':
            return (
              <View key={idx} style={styles.h2Wrapper}>
                <Text
                  style={[
                    styles.h2,
                    {
                      color: isUser ? colors.primaryForeground : colors.foreground,
                      lineHeight: 25,
                    },
                  ]}
                >
                  {renderInline(block.content || '', { fontWeight: '700' })}
                </Text>
              </View>
            );

          case 'h3':
            return (
              <View key={idx} style={styles.h3Wrapper}>
                <Text
                  style={[
                    styles.h3,
                    {
                      color: isUser ? colors.primaryForeground : colors.primary,
                      lineHeight: 23,
                    },
                  ]}
                >
                  {renderInline(block.content || '', { fontWeight: '600' })}
                </Text>
              </View>
            );

          case 'h4':
            return (
              <View key={idx} style={styles.h4Wrapper}>
                <Text
                  style={[
                    styles.h4,
                    {
                      color: isUser ? colors.primaryForeground : colors.foreground,
                      lineHeight: 21,
                    },
                  ]}
                >
                  {renderInline(block.content || '', { fontWeight: '600' })}
                </Text>
              </View>
            );

          case 'p':
            return (
              <Text
                key={idx}
                style={[
                  styles.paragraph,
                  {
                    color: textColor,
                    lineHeight: 22,
                  },
                ]}
              >
                {renderInline(block.content || '')}
              </Text>
            );

          case 'bullet':
            return (
              <View key={idx} style={styles.listContainer}>
                {block.items?.map((item, itemIdx) => (
                  <View
                    key={itemIdx}
                    style={[
                      styles.listItemRow,
                      { paddingLeft: (item.indent || 0) * 16 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.bulletDot,
                        {
                          color: isUser ? colors.primaryForeground : colors.primary,
                        },
                      ]}
                    >
                      •
                    </Text>
                    <Text
                      style={[
                        styles.listItemText,
                        {
                          color: textColor,
                          lineHeight: 21,
                        },
                      ]}
                    >
                      {renderInline(item.text)}
                    </Text>
                  </View>
                ))}
              </View>
            );

          case 'number':
            return (
              <View key={idx} style={styles.listContainer}>
                {block.items?.map((item, itemIdx) => (
                  <View
                    key={itemIdx}
                    style={[
                      styles.listItemRow,
                      { paddingLeft: (item.indent || 0) * 16 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberPrefix,
                        {
                          color: isUser ? colors.primaryForeground : colors.primary,
                        },
                      ]}
                    >
                      {item.prefix || `${itemIdx + 1}.`}
                    </Text>
                    <Text
                      style={[
                        styles.listItemText,
                        {
                          color: textColor,
                          lineHeight: 21,
                        },
                      ]}
                    >
                      {renderInline(item.text)}
                    </Text>
                  </View>
                ))}
              </View>
            );

          case 'quote':
            return (
              <View
                key={idx}
                style={[
                  styles.quoteBox,
                  {
                    backgroundColor: isUser
                      ? 'rgba(255,255,255,0.1)'
                      : colors.surfaceSubtle,
                    borderLeftColor: isUser
                      ? colors.primaryForeground
                      : colors.primary,
                    borderRadius: theme.radii.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.quoteText,
                    {
                      color: isUser ? colors.primaryForeground : colors.foreground,
                      lineHeight: 21,
                    },
                  ]}
                >
                  {renderInline(block.content || '')}
                </Text>
              </View>
            );

          case 'codeblock':
            return (
              <View
                key={idx}
                style={[
                  styles.codeBlock,
                  {
                    backgroundColor: isUser
                      ? 'rgba(0,0,0,0.15)'
                      : colors.surfaceSubtle,
                    borderColor: isUser
                      ? 'rgba(255,255,255,0.2)'
                      : colors.borderSubtle,
                    borderRadius: theme.radii.md,
                  },
                ]}
              >
                {block.language ? (
                  <Text
                    style={[
                      styles.codeLang,
                      {
                        color: isUser
                          ? colors.primaryForeground
                          : colors.foregroundMuted,
                      },
                    ]}
                  >
                    {block.language}
                  </Text>
                ) : null}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Text
                    style={[
                      styles.codeText,
                      {
                        color: isUser
                          ? colors.primaryForeground
                          : colors.foreground,
                      },
                    ]}
                  >
                    {block.content}
                  </Text>
                </ScrollView>
              </View>
            );

          case 'table':
            return (
              <ScrollView
                key={idx}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tableScroll}
              >
                <View
                  style={[
                    styles.table,
                    {
                      borderColor: colors.borderSubtle,
                      borderRadius: theme.radii.sm,
                    },
                  ]}
                >
                  {/* Table Header */}
                  {block.headers && block.headers.length > 0 && (
                    <View
                      style={[
                        styles.tableRow,
                        styles.tableHeaderRow,
                        {
                          backgroundColor: isUser
                            ? 'rgba(255,255,255,0.15)'
                            : colors.surfaceSubtle,
                          borderBottomColor: colors.borderSubtle,
                        },
                      ]}
                    >
                      {block.headers.map((hdr, hIdx) => (
                        <View
                          key={hIdx}
                          style={[
                            styles.tableCell,
                            hIdx < block.headers!.length - 1 && {
                              borderRightWidth: 1,
                              borderRightColor: colors.borderSubtle,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableHeaderText,
                              {
                                color: isUser
                                  ? colors.primaryForeground
                                  : colors.foreground,
                              },
                            ]}
                          >
                            {renderInline(hdr, { fontWeight: '700' })}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Table Body Rows */}
                  {block.rows?.map((row, rIdx) => (
                    <View
                      key={rIdx}
                      style={[
                        styles.tableRow,
                        rIdx < block.rows!.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: colors.borderSubtle,
                        },
                      ]}
                    >
                      {row.map((cell, cIdx) => (
                        <View
                          key={cIdx}
                          style={[
                            styles.tableCell,
                            cIdx < row.length - 1 && {
                              borderRightWidth: 1,
                              borderRightColor: colors.borderSubtle,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.tableCellText,
                              {
                                color: textColor,
                              },
                            ]}
                          >
                            {renderInline(cell)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            );

          case 'hr':
            return (
              <View
                key={idx}
                style={[
                  styles.hr,
                  {
                    backgroundColor: isUser
                      ? 'rgba(255,255,255,0.2)'
                      : colors.borderSubtle,
                  },
                ]}
              />
            );

          default:
            return null;
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  h1Wrapper: {
    marginTop: 10,
    marginBottom: 6,
  },
  h1: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h2Wrapper: {
    marginTop: 8,
    marginBottom: 5,
  },
  h2: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  h3Wrapper: {
    marginTop: 6,
    marginBottom: 4,
  },
  h3: {
    fontSize: 15,
    fontWeight: '600',
  },
  h4Wrapper: {
    marginTop: 4,
    marginBottom: 3,
  },
  h4: {
    fontSize: 14,
    fontWeight: '600',
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
  },
  listContainer: {
    marginBottom: 8,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 14,
    lineHeight: 20,
    width: 14,
    textAlign: 'center',
    marginRight: 6,
    fontWeight: '700',
  },
  numberPrefix: {
    fontSize: 13,
    lineHeight: 20,
    minWidth: 18,
    fontWeight: '700',
    marginRight: 6,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
  },
  quoteBox: {
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 6,
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  codeBlock: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
  },
  codeLang: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  codeText: {
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    lineHeight: 19,
  },
  tableScroll: {
    marginVertical: 8,
  },
  table: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderRow: {
    borderBottomWidth: 1,
  },
  tableCell: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 80,
    justifyContent: 'center',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tableCellText: {
    fontSize: 13,
    lineHeight: 18,
  },
  hr: {
    height: 1,
    marginVertical: 10,
    width: '100%',
  },
});
