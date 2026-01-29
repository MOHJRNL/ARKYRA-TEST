import { thirdPartyWrapper } from '@gitroom/frontend/components/third-parties/third-party.wrapper';
import { useThirdPartySubmit } from '@gitroom/frontend/components/third-parties/third-party.function';
import { useThirdParty } from '@gitroom/frontend/components/third-parties/third-party.media';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Textarea } from '@gitroom/react/form/textarea';
import { Button } from '@gitroom/react/form/button';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';
import { Input } from '@gitroom/react/form/input';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';

const RunwayProviderComponent = () => {
  const thirdParty = useThirdParty();
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      prompt: '',
      duration: '5',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        prompt: string().min(10, 'Prompt must be at least 10 characters long'),
        duration: string().min(1, 'Duration is required'),
      })
    ),
  });

  const submit: SubmitHandler<any> = useCallback(
    async (params) => {
      thirdParty.onChange(await send(params));
      thirdParty.close();
    },
    []
  );

  return (
    <div>
      {form.formState.isSubmitting && (
        <div className="fixed left-0 top-0 w-full leading-[50px] pt-[200px] h-screen bg-newBgColorInner/90 z-50 flex flex-col justify-center items-center text-center text-3xl">
          Creating your Runway video...
          <br />
          This may take several minutes.
          <br />
          DO NOT CLOSE THIS WINDOW!
          <br />
          <LoadingComponent width={200} height={200} />
        </div>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="w-full flex flex-col"
        >
          <Textarea
            label="Prompt"
            {...form.register('prompt')}
            placeholder="Describe the video you want to create..."
          />

          <Input
            label="Duration (seconds)"
            type="number"
            {...form.register('duration')}
            placeholder="5"
          />

          <Button type="submit">Generate Video</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('runway', RunwayProviderComponent);
