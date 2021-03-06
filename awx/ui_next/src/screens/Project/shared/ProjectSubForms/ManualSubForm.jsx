import React from 'react';
import { withI18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { Field } from 'formik';
import { required } from '@util/validators';
import AnsibleSelect from '@components/AnsibleSelect';
import FormField, { FieldTooltip } from '@components/FormField';
import { FormGroup, Alert } from '@patternfly/react-core';
import { BrandName } from '../../../../variables';

// Setting BrandName to a variable here is necessary to get the jest tests
// passing.  Attempting to use BrandName in the template literal results
// in failing tests.
const brandName = BrandName;

const ManualSubForm = ({
  i18n,
  localPath,
  project_base_dir,
  project_local_paths,
}) => {
  const localPaths = [...new Set([...project_local_paths, localPath])];
  const options = [
    {
      value: '',
      key: '',
      label: i18n._(t`Choose a Playbook Directory`),
    },
    ...localPaths
      .filter(path => path)
      .map(path => ({
        value: path,
        key: path,
        label: path,
      })),
  ];

  return (
    <>
      {options.length === 1 && (
        <Alert
          title={i18n._(t`WARNING: `)}
          css="grid-column: 1/-1"
          variant="warning"
          isInline
        >
          {i18n._(t`
            There are no available playbook directories in ${project_base_dir}.
            Either that directory is empty, or all of the contents are already
            assigned to other projects. Create a new directory there and make
            sure the playbook files can be read by the "awx" system user,
            or have ${brandName} directly retrieve your playbooks from
            source control using the SCM Type option above.`)}
        </Alert>
      )}
      <FormField
        id="project-base-dir"
        label={i18n._(t`Project Base Path`)}
        name="base_dir"
        type="text"
        isReadOnly
        tooltip={
          <span>
            {i18n._(t`Base path used for locating playbooks. Directories
              found inside this path will be listed in the playbook directory drop-down.
              Together the base path and selected playbook directory provide the full
              path used to locate playbooks.`)}
            <br />
            <br />
            {i18n._(t`Change PROJECTS_ROOT when deploying
              ${brandName} to change this location.`)}
          </span>
        }
      />
      {options.length !== 1 && (
        <Field
          name="local_path"
          validate={required(i18n._(t`Select a value for this field`), i18n)}
        >
          {({ field, form }) => (
            <FormGroup
              fieldId="project-local-path"
              helperTextInvalid={form.errors.local_path}
              isRequired
              isValid={!form.touched.local_path || !form.errors.local_path}
              label={i18n._(t`Playbook Directory`)}
            >
              <FieldTooltip
                content={i18n._(t`Select from the list of directories found in
                the Project Base Path. Together the base path and the playbook
                directory provide the full path used to locate playbooks.`)}
              />
              <AnsibleSelect
                {...field}
                id="local_path"
                data={options}
                onChange={(event, value) => {
                  form.setFieldValue('local_path', value);
                }}
              />
            </FormGroup>
          )}
        </Field>
      )}
    </>
  );
};

export default withI18n()(ManualSubForm);
