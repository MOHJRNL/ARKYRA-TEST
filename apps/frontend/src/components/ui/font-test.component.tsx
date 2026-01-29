/**
 * Font Test Component
 *
 * A test component to verify that fonts are loading correctly
 * for both Arabic and Latin text.
 *
 * This component can be used during development to ensure the
 * Al Jazeera Arabic Bold font is properly applied to Arabic text.
 */

'use client';

import { useFont } from '@gitroom/frontend/hooks/use-font';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

export function FontTestComponent() {
  const {
    getFontClass,
    usesArabicFont,
    currentLanguage,
    brandPrimaryFont,
    isRTL,
  } = useFont();
  const t = useT();

  return (
    <div className="p-6 space-y-4 bg-newBgColorInner rounded-lg border border-newTableBorder">
      <h2 className="text-xl font-bold text-textColor mb-4">
        Font Configuration Test
      </h2>

      {/* Current Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-textColor/60">Current Language:</span>
          <span className="font-semibold text-textColor">{currentLanguage}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-textColor/60">Uses Arabic Font:</span>
          <span className="font-semibold text-textColor">
            {usesArabicFont ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-textColor/60">Is RTL:</span>
          <span className="font-semibold text-textColor">
            {isRTL ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-textColor/60">Brand Primary Font:</span>
          <span className="font-semibold text-textColor">{brandPrimaryFont}</span>
        </div>
      </div>

      {/* Arabic Text Sample */}
      <div className="space-y-2 p-4 bg-newBgColor rounded">
        <h3 className="text-sm font-semibold text-textColor/60 mb-2">
          Arabic Font Sample (Al Jazeera Arabic Bold):
        </h3>
        <p className="text-2xl font-al-jazeera-arabic text-textColor" dir="rtl">
          مرحباً بك في منصة أركيرا
        </p>
        <p className="text-lg font-al-jazeera-arabic text-textColor" dir="rtl">
          الجزيرة - قناة إخبارية عربية
        </p>
        <p className="text-base font-al-jazeera-arabic text-textColor" dir="rtl">
          نظام إدارة وسائل التواصل الاجتماعي
        </p>
      </div>

      {/* Latin Text Sample */}
      <div className="space-y-2 p-4 bg-newBgColor rounded">
        <h3 className="text-sm font-semibold text-textColor/60 mb-2">
          Latin Font Sample (Plus Jakarta Sans):
        </h3>
        <p className="text-2xl font-jakarta-sans text-textColor">
          Welcome to Arkyra Platform
        </p>
        <p className="text-lg font-jakarta-sans text-textColor">
          Al Jazeera - Arabic News Channel
        </p>
        <p className="text-base font-jakarta-sans text-textColor">
          Social Media Management System
        </p>
      </div>

      {/* Dynamic Font Application */}
      <div className="space-y-2 p-4 bg-newBgColor rounded">
        <h3 className="text-sm font-semibold text-textColor/60 mb-2">
          Dynamic Font (Based on Current Language):
        </h3>
        <p className={`text-xl ${getFontClass()} text-textColor`}>
          {usesArabicFont
            ? 'هذا النص يستخدم خط الجزيرة العربي'
            : 'This text uses the current language font'}
        </p>
      </div>

      {/* Font Family CSS Variables */}
      <div className="space-y-2 p-4 bg-newBgColor rounded">
        <h3 className="text-sm font-semibold text-textColor/60 mb-2">
          CSS Variables:
        </h3>
        <div className="font-mono text-xs space-y-1">
          <div className="text-textColor/80">
            <span className="text-secondary">--font-al-jazeera-arabic:</span>{' '}
            <span>Al-Jazeera-Arabic-Bold</span>
          </div>
          <div className="text-textColor/80">
            <span className="text-secondary">--font-jakarta-sans:</span>{' '}
            <span>Plus Jakarta Sans</span>
          </div>
        </div>
      </div>
    </div>
  );
}
