export default class Version {
  constructor(
    public readonly name: string,
    public readonly version_number: string,
    public readonly changelog: string | null,
    public readonly dependencies: Array<Dependency> | null,
    public readonly game_versions: Array<string>,
    public readonly version_type: "release" | "beta" | "alpha",
    public readonly loaders: Array<string>,
    public readonly featured: boolean,
    public readonly id: string,
    public readonly project_id: string,
    public readonly author_id: string,
    public readonly date_published: string,
    public readonly downloads: number,
    public readonly files: Array<File>
  ) {}
}

type Dependency = {
  version_id: string | null;
  project_id: string | null;
  file_name: string | null;
  dependency_type: "required" | "optional" | "incompatible" | "embedded";
};

type File = {
  hashes: {
    sha512: string;
    sha1: string;
  };
  url: string;
  filename: string;
  primary: boolean;
  size: number;
};
