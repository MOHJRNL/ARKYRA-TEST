import { Global, Module } from '@nestjs/common';
import { ThirdPartyManager } from '@gitroom/nestjs-libraries/3rdparties/thirdparty.manager';

// Video/Media Providers
import { HeygenProvider } from '@gitroom/nestjs-libraries/3rdparties/heygen/heygen.provider';
import { SynthesiaProvider } from '@gitroom/nestjs-libraries/3rdparties/synthesia/synthesia.provider';
import { DIdProvider } from '@gitroom/nestjs-libraries/3rdparties/d-id/d-id.provider';
import { RunwayProvider } from '@gitroom/nestjs-libraries/3rdparties/runway/runway.provider';

// Audio Providers
import { ElevenLabsProvider } from '@gitroom/nestjs-libraries/3rdparties/elevenlabs/elevenlabs.provider';
import { MurfProvider } from '@gitroom/nestjs-libraries/3rdparties/murf/murf.provider';
import { PlayHTProvider } from '@gitroom/nestjs-libraries/3rdparties/playht/playht.provider';

// Automation Providers
import { WebhooksProvider } from '@gitroom/nestjs-libraries/3rdparties/webhooks/webhooks.provider';
import { ZapierProvider } from '@gitroom/nestjs-libraries/3rdparties/zapier/zapier.provider';
import { MakeProvider } from '@gitroom/nestjs-libraries/3rdparties/make/make.provider';
import { N8nProvider } from '@gitroom/nestjs-libraries/3rdparties/n8n/n8n.provider';

// Content Source Providers
import { NotionProvider } from '@gitroom/nestjs-libraries/3rdparties/notion/notion.provider';
import { GoogleSheetsProvider } from '@gitroom/nestjs-libraries/3rdparties/google-sheets/google-sheets.provider';
import { AirtableProvider } from '@gitroom/nestjs-libraries/3rdparties/airtable/airtable.provider';
import { GA4Provider } from '@gitroom/nestjs-libraries/3rdparties/ga4/ga4.provider';
import { LookerStudioProvider } from '@gitroom/nestjs-libraries/3rdparties/looker-studio/looker-studio.provider';
import { PostHogProvider } from '@gitroom/nestjs-libraries/3rdparties/posthog/posthog.provider';
import { AmplitudeProvider } from '@gitroom/nestjs-libraries/3rdparties/amplitude/amplitude.provider';

@Global()
@Module({
  providers: [
    // Core Manager
    ThirdPartyManager,

    // Video/Media Providers (4)
    HeygenProvider,
    SynthesiaProvider,
    DIdProvider,
    RunwayProvider,

    // Audio Providers (3)
    ElevenLabsProvider,
    MurfProvider,
    PlayHTProvider,

    // Automation Providers (4)
    WebhooksProvider,
    ZapierProvider,
    MakeProvider,
    N8nProvider,

    // Content Source Providers (7)
    NotionProvider,
    GoogleSheetsProvider,
    AirtableProvider,
    GA4Provider,
    LookerStudioProvider,
    PostHogProvider,
    AmplitudeProvider,
  ],
  get exports() {
    return this.providers;
  },
})
export class ThirdPartyModule {}
