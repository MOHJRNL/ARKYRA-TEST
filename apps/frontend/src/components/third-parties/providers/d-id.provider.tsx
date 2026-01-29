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

const SelectPresenterComponent: FC<{
  presenterList: any[];
  onChange: (id: string) => void;
}> = (props) => {
  const [current, setCurrent] = useState<any>({});
  const { presenterList, onChange } = props;

  return (
    <div className="grid grid-cols-4 gap-[10px] justify-items-center justify-center">
      {presenterList?.map((p) => (
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
          <div>
            <img
              src={p.image_url}
              className="w-full h-full object-cover"
            />
          </div>
          <div>{p.name}</div>
        </div>
      ))}
    </div>
  );
};

const DIdProviderComponent = () => {
  const thirdParty = useThirdParty();
  const { data: presenters } = useThirdPartyFunctionSWR('LOAD_ONCE', 'presenters');
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      script: '',
      presenter: '',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        script: string().min(10, 'Script must be at least 10 characters long'),
        presenter: string().min(1, 'Presenter is required'),
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
          Creating your D-ID video...
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
          <Textarea label="Script" {...form.register('script')} />

          {!!presenters?.length && (
            <>
              <div className="text-lg my-3">Select Presenter</div>
              <SelectPresenterComponent
                presenterList={presenters}
                onChange={(id: string) => form.setValue('presenter', id)}
              />
              <div className="text-red-400 text-[12px] mb-3">
                {form?.formState?.errors?.presenter?.message || ''}
              </div>
            </>
          )}

          <Button type="submit">Generate Video</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('d-id', DIdProviderComponent);
