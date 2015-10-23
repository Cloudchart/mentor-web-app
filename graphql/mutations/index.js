export default {
  ActivateViewer:               require('./activate_viewer_mutation'),
  ThemeToViewer:                require('./theme_to_viewer_mutation'),
  VoteForInsight:               require('./vote_for_insight_mutation'),
  CreateThemeMutation:          require('./create_theme_mutation'),
  UpdateThemeStatus:            require('./update_theme_status_mutation'),
  UpdateUserTheme:              require('./update_user_theme_mutation'),
  ActualizeUserThemeInsights:   require('./ActualizeUserThemeInsightsMutation'),
  ActualizeThemeInsights:       require('./ActualizeThemeInsightsMutation'),
  LikeInsight:                  require('./LikeInsightMutation')
}
