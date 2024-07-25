<script lang="ts">
  import { scanForServerSchema, type ScanForServerSchemaType } from './schema';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '$lib/components/ui/dialog';
  import {
    FormButton,
    FormControl,
    FormDescription,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '$lib/components/ui/form';
  import { cn } from '$lib/utils';
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from '$lib/components/ui/collapsible';
  import { Button } from '$lib/components/ui/button';
  import toast from 'svelte-french-toast';
  import { Input } from '$lib/components/ui/input';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { Switch } from '$lib/components/ui/switch';
  import { ChevronRightIcon, LoaderCircle } from 'lucide-svelte';

  let dialogOpen = false;

  export let data: SuperValidated<Infer<ScanForServerSchemaType>>;

  const form = superForm(data, {
    dataType: 'json',
    validators: zodClient(scanForServerSchema),
    onError: (e) => {
      console.error('Client-side: FormError:', e);
    },
    onResult: ({ result }) => {
      if (result.type === 'success') {
        toast.success('Server created successfully!');
        dialogOpen = false;
      } else {
        console.error('Server-failure: Result:', result);
        toast.error('Server failed to create.');
      }
    },
  });

  const { form: formData, enhance, submitting } = form;
</script>

<Dialog bind:open={dialogOpen}>
  <DialogTrigger asChild let:builder>
    <slot {builder} />
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Scan For Server</DialogTitle>
    </DialogHeader>

    <form method="POST" action="?/scan" use:enhance>
      <!-- <FormField {form} name={'name'}>
        <FormControl let:attrs>
          <FormLabel>Name</FormLabel>
          <Input
            {...attrs}
            bind:value={$formData.name}
            placeholder={'e.g. CuteHub'}
            type={'text'}
          />
          <FormFieldErrors />
        </FormControl>
      </FormField> -->

      <DialogFooter>
        <FormButton disabled={$submitting}>
          <LoaderCircle class={cn('mr-2 h-4 w-4 animate-spin', !$submitting && 'hidden')} />
          Scan
        </FormButton>
      </DialogFooter>
    </form>

    <form method="POST" action="?/create" use:enhance>
      <FormField {form} name={'privateKey'}>
        <FormControl let:attrs>
          <FormLabel>Private Key</FormLabel>
          <Input
            {...attrs}
            bind:value={$formData.privateKey}
            placeholder={'Your private key'}
            type={'text'}
          />
          <FormFieldErrors />
        </FormControl>
      </FormField>

      <DialogFooter>
        <FormButton disabled={$submitting}>
          <LoaderCircle class={cn('mr-2 h-4 w-4 animate-spin', !$submitting && 'hidden')} />
          Create
        </FormButton>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
