import React from 'react';
import styles from '../styles/UserInfo.module.scss';
import TreeCounter from './../../../common/TreeCounter/TreeCounter';
import UserProfileOptions from './UserProfileOptions';

export default function UserInfo({
  userprofile,
  handleTextCopiedSnackbarOpen,
}: any) {
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        hideTarget // changes in TreeCounter component UI
        target={userprofile.score.target}
        planted={userprofile.score.received}
      />

      <h2 className={styles.treeCounterName}>{`${userprofile.displayName}`}</h2>

      {(
        <React.Fragment>
          {/* user bio */}
          <p className={styles.treeCounterDescription}>
            {userprofile.bio}{' '}
          </p>

          {/* three icons in a row */}
          <UserProfileOptions
            userprofile={userprofile}
            handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
          />
        </React.Fragment>
      )}
    </div>
  );
}
