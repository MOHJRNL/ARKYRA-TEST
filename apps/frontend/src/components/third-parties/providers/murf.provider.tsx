import { thirdPartyWrapper } from '@gitroom/frontend/components/third-parties/third-party.wrapper';
import {
  useThirdPartyFunctionSWR,
  useThirdPartySubmit,
} from '@gitroom/frontend/components/third-parties/third-party.function';
import { useThirdParty } from '@gitroom/frontend/components/third-parties/third-party.media';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Textarea } from '@gitroom/react/form/textarea';
import { Button } from '@gitroom/react/form/button';
import { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';

const SelectVoiceComponent: FC<{
  voiceList: any[];
  onChange: (id: string) => void;
}> = (props) => {
  const [current, setCurrent] = useState<any>({});
  const { voiceList, onChange } = props;

  return (
    <div className="grid grid-cols-6 gap-[10px] justify-items-center justify-center">
      {voiceList?.map((p) => (
        <div
          onClick={() => {
            setCurrent(p.id === current?.id ? undefined : p);
            onChange(p.id === current?.id ? '' : p.id);
          }}
          key={p.id}
          className={clsx(
            'w-full h-full p-[20px] min-h-[100px] text-[14px] hover:bg-input transition-all text-textColor relative flex flex-col gap-[15px] cursor-pointer',
            current?.id === p.id
              ? 'bg-input border border-forth'
              : 'bg-third'
          )}
        >
          <div className="text-[14px] text-balance whitespace-pre-line">
            {p.name}
          </div>
          <div className="text-[12px]">{p.language}</div>
        </div>
      ))}
    </div>
  );
};

const MurfProviderComponent = () => {
  const thirdParty = useThirdParty();
  const { data: voices } = useThirdPartyFunctionSWR('LOAD_ONCE', 'voices');
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      text: '',
      voice: '',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        text: string().min(10, 'Text must be at least 10 characters long'),
        voice: string().min(1, 'Voice is required'),
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
          Creating your Murf audio...
          <br />
          This may take a moment.
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
          <Textarea label="Text to Speech" {...form.register('text')} />

          {!!voices?.length && (
            <>
              <div className="text-lg my-3">Select Voice</div>
              <SelectVoiceComponent
                voiceList={voices}
                onChange={(id: string) => form.setValue('voice', id)}
              />
              <div className="text-red-400 text-[12px] mb-3">
                {form?.formState?.errors?.voice?.message || ''}
              </div>
            </>
          )}

          <Button type="submit">Generate Audio</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('murf', MurfProviderComponent);
