import React, { Fragment } from 'react';
import { string, bool, func } from 'prop-types';
import { withI18n } from '@lingui/react';
import {
  Button,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  Tooltip,
} from '@patternfly/react-core';
import { t } from '@lingui/macro';
import { Link } from 'react-router-dom';
import { PencilAltIcon, SyncIcon } from '@patternfly/react-icons';

import ClipboardCopyButton from '@components/ClipboardCopyButton';
import DataListCell from '@components/DataListCell';
import DataListCheck from '@components/DataListCheck';
import ProjectSyncButton from '../shared/ProjectSyncButton';
import { StatusIcon } from '@components/Sparkline';
import VerticalSeparator from '@components/VerticalSeparator';
import { toTitleCase } from '@util/strings';
import { Project } from '@types';

class ProjectListItem extends React.Component {
  static propTypes = {
    project: Project.isRequired,
    detailUrl: string.isRequired,
    isSelected: bool.isRequired,
    onSelect: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.generateLastJobTooltip = this.generateLastJobTooltip.bind(this);
  }

  generateLastJobTooltip = job => {
    const { i18n } = this.props;
    return (
      <Fragment>
        <div>{i18n._(t`MOST RECENT SYNC`)}</div>
        <div>
          {i18n._(t`JOB ID:`)} {job.id}
        </div>
        <div>
          {i18n._(t`STATUS:`)} {job.status.toUpperCase()}
        </div>
        {job.finished && (
          <div>
            {i18n._(t`FINISHED:`)} {job.finished}
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    const { project, isSelected, onSelect, detailUrl, i18n } = this.props;
    const labelId = `check-action-${project.id}`;
    return (
      <DataListItem
        key={project.id}
        aria-labelledby={labelId}
        id={`${project.id}`}
      >
        <DataListItemRow>
          <DataListCheck
            id={`select-project-${project.id}`}
            checked={isSelected}
            onChange={onSelect}
            aria-labelledby={labelId}
          />
          <DataListItemCells
            dataListCells={[
              <DataListCell key="divider">
                <VerticalSeparator />
                {project.summary_fields.last_job && (
                  <Tooltip
                    position="top"
                    content={this.generateLastJobTooltip(
                      project.summary_fields.last_job
                    )}
                    key={project.summary_fields.last_job.id}
                  >
                    <Link
                      to={`/jobs/project/${project.summary_fields.last_job.id}`}
                    >
                      <StatusIcon
                        status={project.summary_fields.last_job.status}
                      />
                    </Link>
                  </Tooltip>
                )}
                <Link
                  id={labelId}
                  to={`${detailUrl}`}
                  css={{ marginLeft: '10px' }}
                >
                  <b>{project.name}</b>
                </Link>
              </DataListCell>,
              <DataListCell key="type">
                {project.scm_type === ''
                  ? i18n._(t`Manual`)
                  : toTitleCase(project.scm_type)}
              </DataListCell>,
              <DataListCell alignRight isFilled={false} key="revision">
                {project.scm_revision.substring(0, 7)}
                {project.scm_revision ? (
                  <ClipboardCopyButton
                    stringToCopy={project.scm_revision}
                    hoverTip={i18n._(t`Copy full revision to clipboard.`)}
                    clickTip={i18n._(t`Successfully copied to clipboard!`)}
                  />
                ) : null}
              </DataListCell>,
              <DataListCell alignRight isFilled={false} key="sync">
                {project.summary_fields.user_capabilities.start && (
                  <Tooltip content={i18n._(t`Sync Project`)} position="top">
                    <ProjectSyncButton projectId={project.id}>
                      {handleSync => (
                        <Button variant="plain" onClick={handleSync}>
                          <SyncIcon />
                        </Button>
                      )}
                    </ProjectSyncButton>
                  </Tooltip>
                )}
              </DataListCell>,
              <DataListCell key="edit" alignRight isFilled={false}>
                {project.summary_fields.user_capabilities.edit && (
                  <Tooltip content={i18n._(t`Edit Project`)} position="top">
                    <Button
                      variant="plain"
                      component={Link}
                      to={`/projects/${project.id}/edit`}
                    >
                      <PencilAltIcon />
                    </Button>
                  </Tooltip>
                )}
              </DataListCell>,
            ]}
          />
        </DataListItemRow>
      </DataListItem>
    );
  }
}
export default withI18n()(ProjectListItem);
