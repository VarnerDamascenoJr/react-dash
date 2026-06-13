import { useState, type ChangeEvent } from 'react';
import './new.scss';
import { DriveFolderUploadOutlined } from '@mui/icons-material';
import type { NewPageProps } from '../../types';

const fallbackImage =
  'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg';

const New = ({ inputs = [], title = 'Add New Item' }: NewPageProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  return (
    <div className="newPage">
      <section className="pageIntro">
        <div>
          <span className="pageIntro__eyebrow">Create record</span>
          <h2>{title}</h2>
        </div>
        <p>Capture the essentials, attach a visual and publish a clean entry.</p>
      </section>

      <div className="editorPanel">
        <div className="editorPanel__preview">
          <img
            src={file ? URL.createObjectURL(file) : fallbackImage}
            alt="Preview"
          />
          <div className="previewCopy">
            <strong>Visual preview</strong>
            <span>Upload a cover image to personalize the record.</span>
          </div>
        </div>
        <div className="editorPanel__form">
          <form action="">
            <div className="formInput formInput--upload">
              <label htmlFor="file">
                Image asset <DriveFolderUploadOutlined className="icon" />
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            {inputs.map((input) => (
              <div className="formInput" key={input.id}>
                <label>{input.label}</label>
                <input
                  type={input.type}
                  placeholder={input.placeholder ?? ''}
                />
              </div>
            ))}
            <button type="submit">Save entry</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default New;
